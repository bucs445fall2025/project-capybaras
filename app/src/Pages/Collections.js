import React, { useState } from 'react';
import '../Styles/Collections.css';
import RecipeCard from '../Components/RecipeCard';

function Collections() {
  const [folders, setFolders] = useState([
    { id: 1, name: 'Likes', recipes: [
      { id: 1, title: 'Creamy Tuscan Lobster', imageUrl: 'https://www.foodandwine.com/thmb/js1XrL-_jZHQ7k8Z1He_tayQ6SQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Creamy-Tuscan-Lobster-Pasta-FT-Recipe-0625-4294969f2a074028a5ea2bef81c79ca8.jpg' },
    ] },
    { id: 2, name: 'Quick Meals', recipes: [] },
    { id: 3, name: 'Italian', recipes: [] },
  ]);

  const [selectedFolderId, setSelectedFolderId] = useState(1);

  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const [openMenuFolderId, setOpenMenuFolderId] = useState(null);

  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  const selectedFolder = folders.find(f => f.id === selectedFolderId);

  // add new folder
  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
        return;
    }

    const newFolder = { id: Date.now(), name: newFolderName, recipes: [] };
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  // delete folder 
  const handleDeleteFolder = (id) => {
    if (id === 1) {
        return alert("cannot delete Likes");
    }

    setFolders(folders.filter(f => f.id !== id));
    if (id === selectedFolderId) {
        setSelectedFolderId(1);
    }

    setOpenMenuFolderId(null);
  };

  // edit button
  const handleEditFolder = (folder) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
    setOpenMenuFolderId(null); 
  };

  // save edited folder name
  const handleSaveEdit = () => {
    if (!editingFolderName.trim()) {
        return;
    }

    setFolders(folders.map(folder => {
        if (folder.id === editingFolderId) {
            return { ...folder, name: editingFolderName };
        }
        return folder;
    }));

    setEditingFolderId(null);
  };

  return (
    <div className="collections-page">
      {/* left sidebar */}
      <aside className="sidebar">
        <div className="folders-header">
          <h2>Folders</h2>
          <button
            className="add-folder-btn"
            onClick={() => setShowNewFolderInput(!showNewFolderInput)}
          >
            +
          </button>
        </div>

        {/* new folder input field */}
        {showNewFolderInput && (
          <div className="add-folder-input">
            <input
              type="text"
              value={newFolderName}
              placeholder="New folder name"
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
            />
            <button onClick={handleAddFolder}>Add</button>
          </div>
        )}

        {/* folder list */}
        <ul>
          {folders.map(folder => (
            <li
              key={folder.id}
              className={folder.id === selectedFolderId ? 'active' : ''}
              onClick={() => setSelectedFolderId(folder.id)}
            >
              {/* Show input if editing */}
              {editingFolderId === folder.id ? (
                <input
                  type="text"
                  value={editingFolderName}
                  onChange={(e) => setEditingFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                  onBlur={handleSaveEdit}
                  autoFocus
                />
              ) : (
                folder.name
              )}

              {/* edit button for folders except Likes */}
              {folder.id !== 1 && (
                <div className="folder-menu-wrapper" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="folder-menu-btn"
                    onClick={() => setOpenMenuFolderId(openMenuFolderId === folder.id ? null : folder.id)}
                  >
                    ⋮
                  </button>

                  {/* dropdown menu */}
                  {openMenuFolderId === folder.id && (
                    <div className="folder-menu-dropdown">
                      <button onClick={() => handleEditFolder(folder)}>Edit</button>
                      <button onClick={() => handleDeleteFolder(folder.id)}>Delete</button>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </aside>

      {/* right-hand side: recipes in selected folder */}
      <main className="folder-content">
        <h2>{selectedFolder.name}</h2>
        {selectedFolder.recipes.length > 0 ? (
          <div className="recipe-grid-container">
            {selectedFolder.recipes.map(recipe => (
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
