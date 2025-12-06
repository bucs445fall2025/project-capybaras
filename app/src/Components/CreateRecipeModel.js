import { useState } from "react";
import { createRecipe } from "../api";
import '../Styles/CreateRecipeModel.css';

export default function CreateRecipeModel({ user, onClose, onRecipeCreated})
{
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [tags, setTags] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [restrictions, setRestrictions] = useState("");
    const [preparationTime, setPreparationTime] = useState("");
    const [cookTime, setCookTime] = useState("");

    const handleSubmit = async () =>
    {
        const data = {
            name,
            description: description,
            imagePath: imageUrl,
            tags: tags.split("\n"),
            ingredients: ingredients.split("\n"),
            instructions: instructions.split("\n"),
            restrictions: restrictions.split("\n"),
            preparationTime: preparationTime,
            cookTime: cookTime,
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
                <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}/>
                <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)}/>
                <textarea placeholder="Tags (one per line)" value={tags} onChange={e => setTags(e.target.value)}/>
                <textarea placeholder="Ingredients (one per line)" value={ingredients} onChange={e => setIngredients(e.target.value)}/>
                <textarea placeholder="Instructions (one line per line)" value={instructions} onChange={e => setInstructions(e.target.value)}/>
                <textarea placeholder="Dietary Restrictions (one per line)" value={restrictions} onChange={e => setRestrictions(e.target.value)}/>
                <input placeholder="Expected Preparation Time" value={preparationTime} onChange={e => setPreparationTime(e.target.value)}/>
                <input placeholder="Expected Cook Time" value={cookTime} onChange={e => setCookTime(e.target.value)}/>

                <div className="model-actions">
                    <button onClick={onClose} className="cancel">Cancel</button>
                    <button onClick={handleSubmit} className="submit">Create</button>
                </div>
            </div>
        </div>
    );
}