import { useState } from 'react';
import { updateRecipe } from "../api";
import '../Styles/CreateRecipeModel.css';

export default function EditRecipeModel({ recipe, user, onClose, onRecipeUpdated })
{
    const [name, setName] = useState(recipe.name || "");
    const [imageUrl, setImageUrl] = useState(recipe.imagePath || "");
    const [ingredients, setIngredients] = useState((recipe.ingredients || []).join("\n"));
    const [instructions, setInstructions] = useState((recipe.instructions || []).join("\n"));

    const handleSubmit = async () =>
    {
        const data = {
            ...recipe,
            name,
            imagePath: imageUrl,
            ingredients: ingredients.split("\n"),
            instructions: instructions.split("\n"),
            authorId: user._id
        };

        await updateRecipe(recipe._id, data);
        onRecipeUpdated();
        onClose();
    };

    return(
        <div className="model-overlay">
            <div className="model-box">
                <h2>Edit Recipe</h2>

                <input placeholder="Recipe Title" value={name} onChange={e => setName(e.target.value)}/>
                <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)}/>
                <textarea placeholder="Ingredients (one per line)" value={ingredients} onChange={e => setIngredients(e.target.value)}/>
                <textarea placeholder="Instructions (one per line)" value={instructions} onChange={e => setInstructions(e.target.value)}/>

                <div className="model-action">
                    <button onClick={onClose} className="cancel">Cancel</button>
                    <button onClick={handleSubmit} className="submit">Update</button>
                </div>
            </div>
        </div>
    );
}