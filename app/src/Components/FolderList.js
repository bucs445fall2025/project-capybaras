import React, { useState } from 'react';
import '../Styles/FolderList.css';

function FolderList({ folders, selectedFolderId, setSelectedFolderId, onFoldersChange }) {
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [openMenuFolderId, setOpenMenuFolderId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  // add new folder
  const handleAddFolder = () => {
    if (!newFolderName.trim()) {
        return;
    }

    const newFolder = { id: Date.now(), name: newFolderName, recipes: [] };
    onFoldersChange([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolderInput(false);
  };

  // delete folder
  const handleDeleteFolder = (id) => {
    if (id === 1) {
        return alert("Cannot delete 'Likes' folder");
    }

    const updated = folders.filter(f => f.id !== id);
    onFoldersChange(updated);

    if (id === selectedFolderId) {
        setSelectedFolderId(1);
    }
    setOpenMenuFolderId(null);
  };

  // edit folder
  const handleEditFolder = (folder) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
    setOpenMenuFolderId(null);
  };

  // save edited folder
  const handleSaveEdit = () => {
    if (!editingFolderName.trim()) {
        return;
    }
    
    const updated = folders.map(f => {
        if (f.id === editingFolderId) {
            return { ...f, name: editingFolderName };
        }
        return f;
    });

    onFoldersChange(updated);
    setEditingFolderId(null);
  };

  return (
    <aside className="folder-sidebar">
      <div className="folders-header">
        <h2>Folders</h2>
        <button
          className="add-folder-btn"
          onClick={() => setShowNewFolderInput(!showNewFolderInput)}
        >
          +
        </button>
      </div>

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

      <ul>
        {folders.map(folder => (
          <li
            key={folder.id}
            className={folder.id === selectedFolderId ? 'active' : ''}
            onClick={() => setSelectedFolderId(folder.id)}
          >
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

            {folder.id !== 1 && (
              <div className="folder-menu-wrapper" onClick={(e) => e.stopPropagation()}>
                <button
                  className="folder-menu-btn"
                  onClick={() =>
                    setOpenMenuFolderId(openMenuFolderId === folder.id ? null : folder.id)
                  }
                >
                  ⋮
                </button>
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
  );
}

export default FolderList;
