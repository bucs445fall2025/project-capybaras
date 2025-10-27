import React from 'react';
import '../Styles/Collections.css';
import RecipeCard from '../Components/RecipeCard';
import FolderList from '../Components/FolderList';

function Collections({ folders, setFolders, selectedFolderId, setSelectedFolderId, onSave, likedRecipes, onLike }) {
  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  return (
    <div className="collections-page">
      <FolderList
        folders={folders}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        onFoldersChange={setFolders}
      />

      <main className="folder-content">
        {selectedFolder && (
          <>
            <h2>{selectedFolder.name}</h2>
            {selectedFolder.recipes.length > 0 ? (
              <div className="recipe-grid-container">
                {selectedFolder.recipes.map(recipe => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    liked={likedRecipes.some(r => r.id === recipe.id)}
                    onSave={onSave}
                    onLike={onLike}
                    folders={folders}
                  />
                ))}
              </div>
            ) : (
              <p>No recipes saved in this folder yet.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Collections;