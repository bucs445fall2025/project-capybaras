import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import RecipeCard from './Components/RecipeCard'; 
import Collections from './Pages/Collections';
import RecipeDetailPage from './Pages/RecipeDetails';
import SearchBar from './Components/SearchBar';
import MyRecipes from './Pages/MyRecipes';
import Search from './Pages/Search';
import './Styles/App.css'; 
import { fetchRecipes, getRandomRecipes, updateRecipe, searchExternalRecipes, createUser, getUserUsername, saveRecipe, removeSaved, createCollection, addToCollection, getUser, removeFromCollection, createRecipe } from './api';

function HomePage({ user, onLike, onSave, likedRecipeIds, folders, recipes }) {

  return (
    <main className="recipe-grid-container">
      {recipes.map((recipe) => (
        <RecipeCard
            key={recipe.id || recipe._id}
            recipe={recipe}
            onLike={onLike}
            onSave={onSave}
            liked={likedRecipeIds.includes(recipe.id || recipe._id)}
            folders={folders}
        />
      ))}
    </main>
  );
}

function App() {
  const [recipes, setRecipes] = useState([]);
  const [folders, setFolders] = useState([ { id: 1, name: 'Likes', recipes: [] }]);
  const [likedRecipeIds, setLikedRecipeIds] = useState([]);
  const [user, setUser] = useState(null);
  // const [selectedFolderId, setSelectedFolderId] = useState(1);
  // const [searchTerm, setSearchTerm] = useState('');
  const [showConfig, setShowConfig] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("relevance");
  const [selectedOrder, setSelectedOrder] = useState('desc');

  const loadUser = async (userId = localStorage.getItem("userId")) => 
  {
    if (!userId)
    {
      return;
    }

    try {
      const userData = await getUser(userId);
      setUser(userData);

      const likesFolder = 
      {
        id: 1,
        name: 'Likes',
        recipes: (userData.saves || []).map(r => (
        {
          ...r,
          saved: true
        }))
      };

      const collections = (userData.collections || []).map((c, idx) => (
      {
        id: idx + 2,
        name: c.name,
        recipes: (c.recipes || []).map(r => (
        {
          ...r,
          saved: userData.saves.some(s => (s._id || s.id) === (r._id || r.id))
        }))
      }));

      setFolders([likesFolder, ...collections]);
      setLikedRecipeIds((userData.saves || []).map(r => r._id || r.id));
    }
    catch (err) 
    {
      console.error('Failed to load user', err);
      localStorage.removeItem("userId");
      setUser(null);
      setFolders([
        { 
          id: 1, name: 'Likes', recipes: [] 
        }
      ]);
      setLikedRecipeIds([]);
    }
  };

  useEffect(() =>
  {
    loadUser();
  }, []);

  useEffect(() => 
  {
    async function load() {
      try {
        const data = await getRandomRecipes(20);
        setRecipes(data);

        //const liked = data.filter(r => r.likes && r.likes > 0).map(r => r.id || r._id);
        //setLikedRecipeIds(liked);
        setLikedRecipeIds([]);
      }
      catch (err) {
        console.error('Failed to load recipes', err);
      }
    }
    load();
  }, []);

  const handleCreateUser = async (username) =>
  {
    try
    {
      if(!username)
      {
        return;
      }
      const created = await createUser(
        {
          username
        }
      );
      setUser(created);
      localStorage.setItem("userId", created._id);
    }
    catch(err)
    {
      console.error("failed to create user", err);
      if(err.response?.status === 409 || err.message?.includes('already exists'))
      {
        alert('User already exists. Use a different username or login.');
      }
      else
      {
        alert('failed to create user');
      }
    }
  };

  const handleLogin = async (username) =>
  {
    try
    {
      if(!username)
      {
        return;
      }
      const user = await getUserUsername(username);
      localStorage.setItem("userId", user._id);
      const restUser = await getUser(user._id) 
      setUser(user);
      console.debug('logged in', user.username);
      await loadUser();
    }
    catch(err)
    {
      console.error('failed to login', err);
    }
  };

  const handleLogout = async () =>
  {
    localStorage.removeItem("userId");
    setUser(null);
    await loadUser();
  }

  const handleLike = async (recipe) => {
    if(!user)
    {
      alert('Please login first.');
      return;
    }
    try {
      const id = recipe.id || recipe._id;
      const currentlyLiked = likedRecipeIds.includes(id);
      const newLikes = (recipe.likes || 0) + (currentlyLiked ? -1 : 1);

      const updatedRecipe = { ...recipe, likes: newLikes };
      const result = await updateRecipe(id, updatedRecipe);

      setRecipes(prev => prev.map(r => ( (r._id||r.id) === id ? result : r )));

      setLikedRecipeIds(prev => currentlyLiked ? prev.filter(x => x !== id) : [...prev, id]);

      if(!currentlyLiked)
      {
        await saveRecipe(user._id, id);
      }
      else
      {
        await removeSaved(user._id, id);
      }

      setFolders(prev => prev.map(f => {
        if (f.id === 1) {
          const exists = f.recipes.some(rr => (rr._id||rr.id) === id);
          if (currentlyLiked) {
            return { ...f, recipes: f.recipes.filter(rr => (rr._id||rr.id) !== id) };
          } 
          else {
            return { ...f, recipes: [...f.recipes, result] };
          }
        }
        return f;
      }));
    }
    catch (err) {
        console.error('Failed to use like', err);
    }
  };

  const handleSave = async (recipe, folderId) => {
    if(!user)
    {
      alert('Please login first.')
      return;
    }

    try {
      const id = recipe.id || recipe._id;
      const folder = folders.find(f => f.id === folderId);
      if (!folder) {
        console.error('folder not found:', folderId);
        return;
      }

      const folderName = folder.name;

      if(folderId === 1)
      {
        await saveRecipe(user._id, id);
      }
      else
      {
        await addToCollection(user._id, folderName, id);
      }

      const existingTags = Array.isArray(recipe.tags) ? recipe.tags.slice() : [];
      if (!existingTags.includes(folderName)) {
        const updatedRecipe = { ...recipe, tags: [...existingTags, folderName] };
        await updateRecipe(id, updatedRecipe);
      }

      setFolders(prev => prev.map(f => {
        if (f.id === folderId) {
          const exists = f.recipes.some(rr => (rr._id||rr.id) === id);
          if (!exists) {
            return { ...f, recipes: [...f.recipes, recipe] };
          }
        }
        return f;
      }));
      alert(`saved to ${folderName}`);
    }
    catch (err) {
      console.error('Failed to save recipe to folder', err);
      alert('Failed to save recipe');
    }
  };
  /*
  const handleSearch = async (term) => {
    try {
      const external = await searchExternalRecipes(term);
      setRecipes(external);
    } 
    catch (err) {
      console.error('External search failed', err);
    }
  };
  */
  const handleDeleteRecipeFromFolder = async (recipeId, folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) {
      return;
    }

    try
    {
      if(folderId === 1)
      {
        await removeSaved(user._id, recipeId);
      }
      else
      {
        await removeFromCollection(user._id, folder.name, recipeId);
      }

      setFolders(prev => prev.map(f =>
      {
        if(f.id === folderId)
        {
          const updatedRecipes = f.recipes.filter(r => (r._id || r.id) !== recipeId);
          return { ...f, recipes: updatedRecipes };
        }
        return f;
      }
      ));

      if(folderId === 1)
      {
        setLikedRecipeIds(prev => prev.filter(id => id !== recipeId));
      }
    }
    catch(error)
    {
      console.error("failed delete recipe from collection", error);
    }
  };

  const handleRefreshHome = async () =>
  {
    try
    {
      const data = await getRandomRecipes(20);
      setRecipes(data);
    }
    catch(err)
    {
      console.error('failed to refresh homepage', err);
    }
  };

  const handleCreateRecipe = async () =>
  {
    const recipeData = {
      name,
      description,
      ingredients,
      instructions,
      imagePath,
      authorId: user._id
    };

    await createRecipe(recipeData);
  };

  return (
    <Router>
      <div className="app-container">
        <Header 
          user={user}
          onCreateUser={handleCreateUser}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onRefresh={handleRefreshHome}
        />
        <SearchBar
          showConfig={showConfig}
          setShowConfig={setShowConfig}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          selectedSort={selectedSort}
          setSelectedSort={setSelectedSort}
          selectedOrder={selectedOrder}
          setSelectedOrder={setSelectedOrder}
        />
        <Routes>
          <Route path="/" 
            element={
              <HomePage 
                onLike={handleLike} 
                onSave={handleSave} 
                likedRecipeIds={likedRecipeIds} 
                folders={folders} 
                // searchTerm={searchTerm} 
                recipes={recipes}
                onRefresh={handleRefreshHome}
                />
              } 
            />
          <Route path="/search"
            element={
              <Search 
                folders={folders}
                selectedFilters={selectedFilters}
                selectedSort={selectedSort}
                selectedOrder={selectedOrder}/>
            }
           />
          <Route path="/collections" 
            element={
              <Collections 
                user={user}
                folders={folders} 
                setFolders={setFolders}
                // selectedFolderId={selectedFolderId}
                // setSelectedFolderId={setSelectedFolderId}
                onLike={handleLike}
                onSave={handleSave}
                likedRecipeIds={likedRecipeIds} 
                onDeleteRecipe={handleDeleteRecipeFromFolder}
              />
            } 
          />
          <Route path="/my-recipes" element={<MyRecipes user={user} />} />
          <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App