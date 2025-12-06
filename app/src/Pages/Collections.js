import React, { useState } from 'react';
import RecipeCard from '../Components/RecipeCard';
import FolderList from '../Components/FolderList';
import '../Styles/Collections.css';

// function Collections({ folders, setFolders, selectedFolderId, setSelectedFolderId, onSave, likedRecipes, onLike, onDeleteRecipe }) {
function Collections({ user, folders, setFolders, onSave, likedRecipeIds, onLike, onDeleteRecipe }) {
  const [selectedFolderId, setSelectedFolderId] = useState(1);
  const selectedFolder = folders.find(f => f.id === selectedFolderId) || { name: '', recipes: [] };

  return (
    <div className="collections-page">
      <FolderList
        user={user}
        folders={folders}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        onFoldersChange={setFolders}
      />

      <main className="folder-content">
        <h2>{selectedFolder.name}</h2>
        {selectedFolder.recipes && selectedFolder.recipes.length > 0 ? (
          <div className="recipe-grid-container">
            {selectedFolder.recipes.map(recipe => (
              <RecipeCard
                key={recipe.id || recipe._id}
                recipe={recipe}
                folders={folders}
                liked={likedRecipeIds.includes(recipe.id || recipe._id)}
                onSave={onSave}
                onLike={onLike}
                currentFolderId={selectedFolderId} 
                onDelete={onDeleteRecipe}
              />
            ))}
          </div>
        ) : (
          <p>No recipes saved in this folder yet.</p>
        )}
      </main>
    </div>
  );
}

export default Collections;