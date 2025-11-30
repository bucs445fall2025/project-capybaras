import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import '../Styles/RecipeDetails.css';
import { fetchRecipes } from '../api';

// Dummy data array for recipes
/*
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
*/

function RecipeDetailPage() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  
  // const recipe = DUMMY_RECIPES.find(r => r.id.toString() === recipeId);

  useEffect(() =>
  {
    async function load()
    {
      try
      {
        const list = await fetchRecipes();
        const found = list.find(r => (r._id || r.id).toString() === recipeId.toString());
        setRecipe(found || null);
      }
      catch(err)
      {
        console.error('failed to fetch recipe page', err);
      }
    }
    load();
  }, [recipeId]);

  if (!recipe) {
    return (
      <div className="detail-container" style={{ textAlign: 'center' }}>
        <h1 className="detail-title">Recipe Not Found</h1>
        <p>The requested recipe ID: {recipeId} does not exist.</p>
      </div>
    );
  }

  return (
    <div className="detail-container">
      
      {/* 1. Header and Image */}
      <h1 className="detail-title">
        {recipe.name || recipe.title}
      </h1>
      <img 
        src={recipe.imagePath || recipe.imageUrl || recipe.image} 
        alt={recipe.title} 
        className="detail-image"
      />
      
      {/* 2. Description and Time Info */}
      <p className="detail-description">
        {recipe.description || recipe.image || ''}
      </p>
      
      <div className="detail-meta-box">
        {recipe.prepTime && 
          <p style={{ margin: 0 }}><strong>⏱️ Prep Time:</strong> {recipe.prepTime}</p>}
        {recipe.cookTime && 
          <p style={{ margin: 0 }}><strong>🔥 Cook Time:</strong> {recipe.cookTime}</p>}
      </div>
      
      {/* 3. Ingredients List */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <>
          <h3 className="detail-ingredients-heading">Ingredients</h3>
          <ul className="detail-ingredients-list">
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {recipe.instructions && (
        <>
          <h3>Instructions</h3>
          <div dangerouslySetInnerHTML={{__html: recipe.instructions}} />
        </>
      )}
    </div>
  );
}

export default RecipeDetailPage;