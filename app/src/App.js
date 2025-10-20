import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import RecipeCard from './Components/RecipeCard'; 
import Collections from './Pages/Collections';
import './Styles/App.css'; 

// Dummy data array for recipes
const DUMMY_RECIPES = [
  { id: 1, title: 'Creamy Tuscan Lobster', imageUrl: 'https://www.foodandwine.com/thmb/js1XrL-_jZHQ7k8Z1He_tayQ6SQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Creamy-Tuscan-Lobster-Pasta-FT-Recipe-0625-4294969f2a074028a5ea2bef81c79ca8.jpg' },
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

function HomePage() {
  return (
    <main className="recipe-grid-container">
      {DUMMY_RECIPES.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/collections" element={<Collections />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
