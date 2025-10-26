import React, { useState } from 'react';
import '../Styles/Collections.css';
import RecipeCard from '../Components/RecipeCard';
import FolderList from '../Components/FolderList';

function Collections() {
  const [folders, setFolders] = useState([
    {
      id: 1,
      name: 'Likes',
      recipes: [
        {
          id: 1,
          title: 'Creamy Tuscan Lobster',
          imageUrl:
            'https://www.foodandwine.com/thmb/js1XrL-_jZHQ7k8Z1He_tayQ6SQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Creamy-Tuscan-Lobster-Pasta-FT-Recipe-0625-4294969f2a074028a5ea2bef81c79ca8.jpg',
        },
      ],
    },
    { id: 2, name: 'Quick Meals', recipes: [] },
    { id: 3, name: 'Italian', recipes: [] },
  ]);

  const [selectedFolderId, setSelectedFolderId] = useState(1);
  const selectedFolder = folders.find((f) => f.id === selectedFolderId);

  return (
    <div className="collections-page">
      <FolderList
        folders={folders}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        onFoldersChange={setFolders}
      />

      <main className="folder-content">
        <h2>{selectedFolder.name}</h2>
        {selectedFolder.recipes.length > 0 ? (
          <div className="recipe-grid-container">
            {selectedFolder.recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
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
