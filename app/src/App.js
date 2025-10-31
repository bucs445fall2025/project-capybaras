import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import RecipeCard from './Components/RecipeCard'; 
import Collections from './Pages/Collections';
import RecipeDetailPage from './Pages/RecipeDetails';
import './Styles/App.css'; 

// Dummy data array for recipes
const DUMMY_RECIPES = [
  { id: 1, title: 'Creamy Tuscan Lobster', imageUrl: 'https://www.foodandwine.com/thmb/js1XrL-_jZHQ7k8Z1He_tayQ6SQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Creamy-Tuscan-Lobster-Pasta-FT-Recipe-0625-4294969f2a074028a5ea2bef81c79ca8.jpg', 
    description: 'A rich and decadent Italian-inspired pasta dish featuring succulent lobster tails, sun-dried tomatoes, and fresh spinach tossed in a creamy parmesan sauce.',
    prepTime: '20 min',
    cookTime: '35 min',
    ingredients: [
      '1 lb Fettuccine',
      '2 Lobster tails (or shrimp/chicken)',
      '1 cup Heavy cream',
      '1/2 cup Grated Parmesan',
      '1/2 cup Sun-dried tomatoes',
      '2 cups Fresh spinach',
      '3 cloves Garlic, minced',
    ],
  },
  { id: 2, title: 'Garlic Shrimp in Tomato Sauce', imageUrl: 'https://www.foodandwine.com/thmb/xOs2w7R_qbW5EhJHs0UFQq-cqug=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Garlic-shrimp-in-tomato-sauce-FT-RECIPE0424-efd976fab22444e69c7f5b469d5aadd3.jpg' },
  { id: 3, title: 'Cheesy Rice and Bean Bake', imageUrl: 'https://www.twopeasandtheirpod.com/wp-content/uploads/2024/04/Cheesy-Bean-and-Rice-Skillet-3175.jpg' },
  { id: 4, title: '', imageUrl: 'placeholder-4.jpg' },
  { id: 5, title: '', imageUrl: 'placeholder-5.jpg' },
  { id: 6, title: '', imageUrl: 'placeholder-6.jpg' },
  { id: 7, title: '', imageUrl: 'placeholder-7.jpg' },
  { id: 8, title: '', imageUrl: 'placeholder-8.jpg' },
  { id: 9, title: '', imageUrl: 'placeholder-9.jpg' },
  { id: 10, title: '', imageUrl: 'placeholder-10.jpg' },
  { id: 11, title: '', imageUrl: 'placeholder-11.jpg' },
  { id: 12, title: '', imageUrl: 'placeholder-12.jpg' },
];

function HomePage({ onLike, onSave, likedRecipes, folders, searchTerm }) {
  const filteredRecipes = DUMMY_RECIPES.filter(recipe => recipe.title &&
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="recipe-grid-container">
      {filteredRecipes.length > 0 ? (
        filteredRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onLike={onLike}
            onSave={onSave}
            liked={likedRecipes.some(r => r.id === recipe.id)}
            folders={folders}
          />
        ))
      ) : (
        <p>No recipes found.</p>
      )}
    </main>
  );
}


function App() {
  const [folders, setFolders] = useState([
    { id: 1, name: 'Likes', recipes: [] },
    { id: 2, name: 'Quick Meals', recipes: [] },
    { id: 3, name: 'Italian', recipes: [] },
  ]);
  
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [selectedFolderId, setSelectedFolderId] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLike = (recipe) => {
    setLikedRecipes(prev => {
      const alreadyLiked = prev.find(r => r.id === recipe.id);
      if (alreadyLiked) {
        setFolders(f => f.map(folder =>
          folder.id === 1
            ? { ...folder, recipes: folder.recipes.filter(r => r.id !== recipe.id) }
            : folder
        ));
        return prev.filter(r => r.id !== recipe.id);
      } 
      else {
        setFolders(f => f.map(folder =>
          folder.id === 1
            ? { ...folder, recipes: [...folder.recipes, recipe] }
            : folder
        ));
        return [...prev, recipe];
      }
    });
  };

  const handleSave = (recipe, folderId) => {
    setFolders(prev => {
      return prev.map(folder => {
        if (folder.id === folderId) {
          const isAlreadySaved = folder.recipes.some(r => r.id === recipe.id);
          if (!isAlreadySaved) {
            return { ...folder, recipes: [...folder.recipes, recipe] };
          }
        }
        return folder;
      });
    });
  };
  const handleDeleteRecipeFromFolder = (recipeId, folderId) => {
  setFolders(prev => {
    return prev.map(folder => {
      if (folder.id === folderId) {
        const updatedRecipes = folder.recipes.filter(r => r.id !== recipeId);
        return { ...folder, recipes: updatedRecipes };
      }
      return folder;
      });
    });
  if (folderId === 1) {
      setLikedRecipes(prev => prev.filter(r => r.id !== recipeId));
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Routes>
          <Route path="/" 
            element={
              <HomePage 
                onLike={handleLike} 
                onSave={handleSave} 
                likedRecipes={likedRecipes} 
                folders={folders} 
                searchTerm={searchTerm} 
                />
              } 
            />
          <Route path="/collections" 
            element={
              <Collections 
                folders={folders} 
                setFolders={setFolders}
                selectedFolderId={selectedFolderId}
                setSelectedFolderId={setSelectedFolderId}
                onLike={handleLike}
                onSave={handleSave}
                likedRecipes={likedRecipes} 
                onDeleteRecipe={handleDeleteRecipeFromFolder}
              />
            } 
          />
          <Route path="/recipe/:recipeId" element={<RecipeDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;