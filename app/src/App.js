import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import RecipeCard from './Components/RecipeCard'; 
import Collections from './Pages/Collections';
import RecipeDetailPage from './Pages/RecipeDetails';
import SearchBar from './Components/SearchBar';
import './Styles/App.css'; 
import { fetchRecipes, getRandomRecipes, updateRecipe, searchExternalRecipes, createUser, getUserUsername, saveRecipe, removeSaved, createCollection, addToCollection, getUser} from './api';

// // Dummy data array for recipes
// const DUMMY_RECIPES = [
//   { id: 1, title: 'Creamy Tuscan Lobster', imageUrl: 'https://www.foodandwine.com/thmb/js1XrL-_jZHQ7k8Z1He_tayQ6SQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Creamy-Tuscan-Lobster-Pasta-FT-Recipe-0625-4294969f2a074028a5ea2bef81c79ca8.jpg', 
//     description: 'A rich and decadent Italian-inspired pasta dish featuring succulent lobster tails, sun-dried tomatoes, and fresh spinach tossed in a creamy parmesan sauce.',
//     prepTime: '20 min',
//     cookTime: '35 min',
//     ingredients: [
//       '1 lb Fettuccine',
//       '2 Lobster tails (or shrimp/chicken)',
//       '1 cup Heavy cream',
//       '1/2 cup Grated Parmesan',
//       '1/2 cup Sun-dried tomatoes',
//       '2 cups Fresh spinach',
//       '3 cloves Garlic, minced',
//     ],
//   },
//   { id: 2, title: 'Garlic Shrimp in Tomato Sauce', imageUrl: 'https://www.foodandwine.com/thmb/xOs2w7R_qbW5EhJHs0UFQq-cqug=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Garlic-shrimp-in-tomato-sauce-FT-RECIPE0424-efd976fab22444e69c7f5b469d5aadd3.jpg' },
//   { id: 3, title: 'Cheesy Rice and Bean Bake', imageUrl: 'https://www.twopeasandtheirpod.com/wp-content/uploads/2024/04/Cheesy-Bean-and-Rice-Skillet-3175.jpg' },
//   { id: 4, title: '', imageUrl: 'placeholder-4.jpg' },
//   { id: 5, title: '', imageUrl: 'placeholder-5.jpg' },
//   { id: 6, title: '', imageUrl: 'placeholder-6.jpg' },
//   { id: 7, title: '', imageUrl: 'placeholder-7.jpg' },
//   { id: 8, title: '', imageUrl: 'placeholder-8.jpg' },
//   { id: 9, title: '', imageUrl: 'placeholder-9.jpg' },
//   { id: 10, title: '', imageUrl: 'placeholder-10.jpg' },
//   { id: 11, title: '', imageUrl: 'placeholder-11.jpg' },
//   { id: 12, title: '', imageUrl: 'placeholder-12.jpg' },
// ];

function HomePage({ onLike, onSave, likedRecipeIds, folders, recipes }) {
  // const filteredRecipes = DUMMY_RECIPES.filter(recipe => recipe.title &&
  //   recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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

  const handleCreateUser = async () =>
  {
    try
    {
      const username = prompt("Username:");
      if(!username) return;
      const created = await createUser(
        {
          username
        }
      );
      setUser(created);
      alert(`created user: ${created.username}`);
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
      const user = await getUserUsername(username);
      setUser(user);
      alert(`Logged in as: ${user.username}`);
    }
    catch(err)
    {
      console.error('failed to login', err);
      console.error('err.response', err.response?.status, err.response?.data);
      if(err.response?.status === 404)
      {
        alert('user not found (404)');
      }
      else if(err.message)
      {
        alert('Login failed ' + err.message);
      }
      else
      {
        alert('user not found');
      }
    }
  };

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
        return;
      }

      const folderName = folder.name;

      if(folderId === 1)
      {
        await saveRecipe(user._id, id);
      }
      else
      {
        await addToCollection(user._id, folderName, id); // MARKED IMPORTANCE
      }

      const existingTags = Array.isArray(recipe.tags) ? recipe.tags.slice() : [];
      if (existingTags.includes(folderName)) {
        return;
      }
      const updatedRecipe = { ...recipe, tags: [...existingTags, folderName] };

      const result = await updateRecipe(id, updatedRecipe);

      setRecipes(prev => prev.map(r => ( (r._id||r.id) === id ? result : r )));

      setFolders(prev => prev.map(f => {
        if (f.id === folderId) {
          const exists = f.recipes.some(rr => (rr._id||rr.id) === id);
          if (!exists) {
            return { ...f, recipes: [...f.recipes, result] };
          }
        }
        return f;
      }));
    }
    catch (err) {
      console.error('Failed to save recipe to folder', err);
    }
  };

  const handleSearch = async (term) => {
    try {
      const external = await searchExternalRecipes(term);
      setRecipes(external);
    } 
    catch (err) {
      console.error('External search failed', err);
    }
  };

  // const handleDeleteRecipeFromFolder = async (recipeId, folderId) => {
  //   const folder = folders.find(f => f.id === folderId);
  //   if (!folder) {
  //     return;
  //   }

  //   try {
  //     await removeRecipeFromFolder(recipeId, folder.name);

  //     setFolders(prev =>
  //       prev.map(f => {
  //       if (f.id === folderId) {
  //         const updatedRecipes = f.recipes.filter(r => (r._id || r.id) !== recipeId);
  //         return { ...f, recipes: updatedRecipes };
  //       }
  //       return f;
  //     })
  //     );

  //     if (folderId == 1) {
  //       setLikedRecipes(prev => prev.filter(id => id !== recipeId));
  //     }

  //     setRecipes(prev => prev.map(r => ((r._id || r.id) === recipeId ? updatedRecipe : r)));
  //   }
  //   catch (err) {
  //     console.error('Failed to remove recipe from folder', err);
  //   }
  // };

  return (
    <Router>
      <div className="app-container">
        <Header 
          user={user}
          onCreateUser={handleCreateUser}
          onLogin={handleLogin}/>
        <SearchBar onSearch={handleSearch} />
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
                />
              } 
            />
          <Route path="/collections" 
            element={
              <Collections 
                folders={folders} 
                setFolders={setFolders}
                // selectedFolderId={selectedFolderId}
                // setSelectedFolderId={setSelectedFolderId}
                onLike={handleLike}
                onSave={handleSave}
                likedRecipeIds={likedRecipeIds} 
                // onDeleteRecipe={handleDeleteRecipeFromFolder}
              />
            } 
          />
          <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App