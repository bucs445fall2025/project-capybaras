import React from 'react';
import '../Styles/CreateRecipeModel.css';

export default function ConfirmDeleteModel({ onClose, onConfirm, recipeName})
{
    return(
        <div className="model-overlay">
            <div className="model-box">
                <h2>Delete Recipe</h2>
                <p>Are you sure you want to delete this recipe?</p>
                <br></br>
                <p><strong>{recipeName}</strong></p>

                <div className="model-actions">
                    <button onClick={onClose} className="cancel">Cancel</button>
                    <button onClick={onConfirm} className="delete">Delete</button>
                </div>
            </div>
        </div>
    );
}