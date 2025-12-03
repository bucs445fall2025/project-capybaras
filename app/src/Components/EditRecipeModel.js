import { useState } from 'react';
import { updateRecipe } from "../api";
import '../Styles/CreateRecipeModel.css';

export default function EditRecipeModel({ recipe, user, onClose, onRecipeUpdated })
{
    const [name, setName] = useState(recipe.name || "");
    const [description, setDescription] = useState(recipe.description || "");
    const [imageUrl, setImageUrl] = useState(recipe.imagePath || "");
    const [tags, setTags] = useState(recipe.tags || []).join("\n");
    const [ingredients, setIngredients] = useState((recipe.ingredients || []).join("\n"));
    const [instructions, setInstructions] = useState((recipe.instructions || []).join("\n"));
    const [restrictions, setRestrictions] = useState(recipe.restrictions || []).join("\n");
    const [preparationTime, setPreparationTime] = useState(recipe.preparationTime || "");
    const [cookTime, setCookTime] = useState(recipe.cookTime || "");

    const handleSubmit = async () =>
    {
        const data = {
            ...recipe,
            name,
            description, description,
            imagePath: imageUrl,
            tags: tags.split("\n"),
            ingredients: ingredients.split("\n"),
            instructions: instructions.split("\n"),
            restrictions: restrictions.split("\n"),
            preparationTime: preparationTime,
            cookTime: cookTime,
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
                <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}/>
                <input placeholder="Image URL" value={imageUrl} onChange={e => setImageUrl(e.target.value)}/>
                <textarea placeholder="Tags (one per line)" value={tags} onChange={e => setTags(e.target.value)}/>
                <textarea placeholder="Ingredients (one per line)" value={ingredients} onChange={e => setIngredients(e.target.value)}/>
                <textarea placeholder="Instructions (one line per line)" value={instructions} onChange={e => setInstructions(e.target.value)}/>
                <textarea placeholder="Dietary Restrictions (one per line)" value={restrictions} onChange={e => setRestrictions(e.target.value)}/>
                <input placeholder="Expected Preparation Time" value={preparationTime} onChange={e => setPreparationTime(e.target.value)}/>
                <input placeholder="Expected Cook Time" value={cookTime} onChange={e => setCookTime(e.target.value)}/>
                
                <div className="model-action">
                    <button onClick={onClose} className="cancel">Cancel</button>
                    <button onClick={handleSubmit} className="submit">Update</button>
                </div>
            </div>
        </div>
    );
}