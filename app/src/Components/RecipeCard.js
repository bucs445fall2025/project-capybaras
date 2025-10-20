import React from 'react';
import '../Styles/RecipeCard.css'; 

function RecipeCard({ recipe }) {
  const { title, imageUrl } = recipe || {
    title: 'Creamy Tuscan Lobster',
    imageUrl: 'https://www.foodandwine.com/thmb/js1XrL-_jZHQ7k8Z1He_tayQ6SQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Creamy-Tuscan-Lobster-Pasta-FT-Recipe-0625-4294969f2a074028a5ea2bef81c79ca8.jpg'
  };

  return (
    <div className="recipe-card">
      <div className="image-container">
        {/* Recipe Image */}
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
  );
}

export default RecipeCard;
