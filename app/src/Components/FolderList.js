import React, { useState } from 'react';
import { createCollection, removeFromCollection, removeSaved, getUser, updateCollectionName, deleteCollection } from '../api';
import '../Styles/FolderList.css';

function FolderList({ user, folders, selectedFolderId, setSelectedFolderId, onFoldersChange }) {
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [openMenuFolderId, setOpenMenuFolderId] = useState(null);
  const [editingFolderId, setEditingFolderId] = useState(null);
  const [editingFolderName, setEditingFolderName] = useState('');

  const handleAddFolder = async () => 
  {
    if(!user?._id)
    {
      return;
    }
    
    if (!newFolderName.trim()) 
    {
      return;
    }

    try
    {
      const updatedUser = await createCollection(user._id, newFolderName);
      if(!updatedUser || !updatedUser.collections)
      {
        console.error('Invalid user returned from createCollection:', updatedUser);
        return;
      }

      const newCollection = updatedUser.collections[updatedUser.collections.length - 1];

      const newFolder = {
        id: newCollection._id,
        name: newCollection.name,
        recipes: newCollection.recipes || []
      };

      onFoldersChange([...folders, newFolder]);
      setNewFolderName('');
      setShowNewFolderInput(false);
    } 
    catch(err) 
    {
      console.error('Failed to create collection', err);
      alert('Failed to create collection');
    }
  };

  // delete folder
  const handleDeleteFolder = async (folder) => {
    if (folder.id === 1) {
        return alert("Cannot delete 'Likes' folder");
    }
    try
    { 
      await deleteCollection(user._id, folder.name);
      const updated = folders.filter(f => f.id !== folder.id);
      onFoldersChange(updated);

      if (folder.id === selectedFolderId) {
          setSelectedFolderId(1);
      }
      setOpenMenuFolderId(null);
    }
    catch(err)
    {
      console.error('failed to delete collection', err);
    }
  };

  // edit folder
  const handleEditFolder = (folder) => {
    setEditingFolderId(folder.id);
    setEditingFolderName(folder.name);
    setOpenMenuFolderId(null);
  };

  // save edited folder
  const handleSaveEdit = async () => {
    if (!editingFolderName.trim()) {
        return;
    }
    
    const collToEdit = folders.find(f => f.id === editingFolderId);
    if(!collToEdit)
    {
      return;
    }

    try
    {
      await fetch(`/users/${user._id}/collections/${collToEdit.name}/edit`,
        {
          method: 'PUT',
          headers:
          {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
            {
              newName: editingFolderName,
              newDesc: collToEdit.description || ""
            }
          )
        }
      );
      const updatedFolders = folders.map(f =>
      {
        if(f.id === editingFolderId)
        {
          return { ...f, name: editingFolderName};
        }
        return f;
      }
      );

      onFoldersChange(updatedFolders);
      setEditingFolderId(null);
    }
    catch(err)
    {
      console.error('failed to edit collection', err);
    }
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
                    <button onClick={() => handleDeleteFolder(folder)}>Delete</button>
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
