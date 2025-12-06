import React from 'react';
import { Link } from 'react-router-dom';
import '../Styles/MyRecipeCard.css'

export default function MyRecipeCard({ recipe, onEdit, onDelete })
{
    const id = recipe.id || recipe._id;
    const title = recipe.name || recipe.title || 'Untitled';
    const imageUrl = recipe.imagePath || recipe.imageUrl || recipe.image;

    const handleEdit = (e) =>
    {
        e.preventDefault();
        e.stopPropagation();
        onEdit && onEdit(recipe);
    };

    const handleDelete = (e) =>
    {
        e.preventDefault();
        e.stopPropagation();
        onDelete && onDelete(recipe);
    };

    return(
        <div className='my-recipe-card'>
            <Link to={`/recipe/${id}`} className='my-recipe-card-link'>
                <div className="my-image-container">
                    <img src={imageUrl} alt={title} className="my-recipe-image" />
                    <div className="my-recipe-actions">
                        <button className="edit-button" onClick={handleEdit} title="Edit Recipe">✏️</button>
                        <button className="delete-button" onClick={handleDelete} title="Delete Recipe">❌</button>
                    </div>
                </div>
                <h3 className="my-recipe-title">{title}</h3>
            </Link>
        </div>
    );
}