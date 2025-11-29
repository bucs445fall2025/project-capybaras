import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import '../Styles/RecipeCard.css'; 

function RecipeCard({ recipe, liked = false, onLike, onSave, folders = []}) {
  const id = recipe.id || recipe._id;
  const title = recipe.name || recipe.title || 'Untitled';
  const imageUrl = recipe.imagePath || recipe.imageUrl || '';
  const [isLiked, setIsLiked] = useState(liked);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setIsLiked(liked);
  }, [liked]);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
    onLike && onLike(recipe);
  };

  const handleSaveClick = async (e, folderId) => {
    e.preventDefault();
    e.stopPropagation();
    if (onSave) {
      await onSave(recipe, folderId); 
      setShowDropdown(false);
    }
  };

  const recipePath = `/recipe/${id}`;

  // const handleDeleteClick = (e) => {
  //   e.preventDefault(); 
  //   e.stopPropagation(); 
    
  //   if (onDeleteRecipe && currentFolderId) {
  //     onDeleteRecipe(id, currentFolderId);
  //   }
  // };

  // const isInCollection = currentFolderId != null;

  return (
    <Link to={recipePath} className="recipe-card-link-wrapper" onClick={(e)=>{ /* link still works */ }}>
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
              className={`like-button ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
              title={isLiked ? "Unlike" : "Like"}
            >
              ❤️
            </button>

            <div className="save-wrapper">
              <button
                className="save-button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                title="Save to folder"
              >
                🏷️
              </button>

              {showDropdown && folders.length > 0 && (
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
            {/* {isInCollection && (
              <button 
                className="delete-button" 
                onClick={handleDeleteClick}
                title="Remove from this folder"
              >
                🗑️
              </button>
            )} */}
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