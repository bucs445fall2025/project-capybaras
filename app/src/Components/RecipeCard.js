import React from 'react';
import { Link } from 'react-router-dom'; 
import '../Styles/RecipeCard.css'; 

function RecipeCard({ recipe }) {
  const { id, title, imageUrl } = recipe || {
    id: 'default-id', 
    title: 'Creamy Tuscan Lobster',
    imageUrl: '...' 
  };

  const recipePath = `/recipe/${id}`; 

  return (
    <Link to={recipePath} className="recipe-card-link-wrapper">
      <div className="recipe-card">
        <div className="image-container">
          <img 
            src={imageUrl} 
            alt={title} 
            className="recipe-image" 
          />
        </div>
        
        {/* Recipe Title */}
        <h3 className="recipe-title">
          {title}
        </h3>
      </div>
    </Link>
  );
}

export default RecipeCard;
