import { useState } from "react";
import { createRecipe } from "../api";
import '../Styles/CreateRecipeModel.css';

export default function CreateRecipeModel({ user, onClose, onRecipeCreated})
{
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");

    const handleSubmit = async () =>
    {
        const data = {
            name,
            imagePath: imageUrl,
            ingredients: ingredients.split("\n"),
            instructions: instructions.split("\n"),
            authorId: user._id
        };

        await createRecipe(data);
        onRecipeCreated();
        onClose();
    };

    return (
        <div className="model-overlay">
            <div className="model-box">
                <h2>Create Recipe</h2>

                <input placeholder="Recipe Title" value={name} onChange={e => setName(e.target.value)}/>
                <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)}/>
                <textarea placeholder="Ingredients (one per line)" value={ingredients} onChange={e => setIngredients(e.target.value)}/>
                <textarea placeholder="Instructions (one line per line)" value={instructions} onChange={e => setInstructions(e.target.value)}/>

                <div className="model-actions">
                    <button onClick={onClose} className="cancel">Cancel</button>
                    <button onClick={handleSubmit} className="submit">Create</button>
                </div>
            </div>
        </div>
    );
}