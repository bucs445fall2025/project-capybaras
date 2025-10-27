import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import '../Styles/RecipeCard.css'; 

function RecipeCard({ recipe, liked = false, onLike, onSave, folders = [], currentFolderId, onDeleteRecipe}) {
  const { id, title, imageUrl } = recipe;
  const recipePath = `/recipe/${id}`;
  const [IsLiked, setIsLiked] = useState(liked);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLike = (e) => {
    e.preventDefault();
    setIsLiked(!IsLiked);
    onLike && onLike(recipe);
  };

  const handleSaveClick = (e, folderId) => {
    e.preventDefault();
    onSave && onSave(recipe, folderId);
    setShowDropdown(false);
  };
  const handleDeleteClick = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 
    
    if (onDeleteRecipe && currentFolderId) {
      onDeleteRecipe(id, currentFolderId);
    }
  };

  const isInCollection = currentFolderId != null;
  return (
    <Link to={recipePath} className="recipe-card-link-wrapper">
      <div className="recipe-card">
        <div className="image-container">
          <img 
            src={imageUrl} 
            alt={title} 
            className="recipe-image" 
          />

          {/* buttons */}
          <div className="recipe-card-actions">
            <button
              className={`like-button ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              ❤️
            </button>

            <div className="save-wrapper">
              <button
                className="save-button"
                onClick={(e) => {
                  e.preventDefault();
                  setShowDropdown(!showDropdown);
                }}
              >
                🏷️
              </button>

              {showDropdown && (
                <div className="save-dropdown">
                  {folders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={(e) => handleSaveClick(e, folder.id)}
                    >
                      {folder.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {isInCollection && (
              <button 
                className="delete-button" 
                onClick={handleDeleteClick}
                title="Remove from this folder"
              >
                🗑️
              </button>
            )}
          </div>
        </div>
        
        <h3 className="recipe-title">
          {title}
        </h3>
      </div>
    </Link>
  );
}

export default RecipeCard;