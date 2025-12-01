import { useEffect, useState } from "react";
import { getUser, deleteRecipe as delRecipe } from "../api";
import MyRecipeCard from "../Components/MyRecipeCard";
import CreateRecipeModel from "../Components/CreateRecipeModel";
import EditRecipeModel from "../Components/EditRecipeModel";
import ConfirmDeleteModel from "../Components/ConfirmDeleteModel";
import "../Styles/CreateRecipeModel.css";

export default function MyRecipes({ user })
{
    const [recipes, setRecipes] = useState([]);
    const [showCreateModel, setShowCreateModel] = useState(false);
    const [editRecipe, setEditRecipe] = useState(null);
    const [deleteRecipe, setDeleteRecipe] = useState(null);

    const load = async () => {
        if(!user?._id)
        {
            return;
        }

        const data = await getUser(user._id);
        setRecipes(data.created);
    };

    useEffect(() => 
    {
        load();
    }, [user]);

    const handleEdit = (recipe) => setEditRecipe(recipe);

    const handleDelete = (recipe) => setDeleteRecipe(recipe);

    const confirmDelete = async () =>
    {
        try
        {
            await delRecipe(deleteRecipe._id, user._id);
            setDeleteRecipe(null);
            load();
        }
        catch(err)
        {
            console.error('failed to delete', err);
        }
    };

    return (
        <div className="my-recipes-page">
            <div className="my-recipes-header">
                <h1 style={{ textAlign: "center" }}>Your Recipes</h1>
                <div className="button-center">
                    <button onClick={() => setShowCreateModel(true)} className="create-btn">
                    Create Recipe
                </button>
                </div>
            </div>

            <div className={`recipes-grid ${recipes.length === 0 ? "empty" : ""}`}>
                {recipes.length === 0 && <p>No recipes created yet.</p>}
                {recipes.map(r => (
                    <MyRecipeCard key={r._id} recipe={r} onEdit={handleEdit} onDelete={handleDelete}/>
                ))}
            </div>

            {showCreateModel && (
                <CreateRecipeModel
                user={user}
                onClose={() => setShowCreateModel(false)}
                onRecipeCreated={load}
                />
            )}

            {editRecipe && (
                <EditRecipeModel
                recipe={editRecipe}
                user={user}
                onClose={() => setEditRecipe(null)}
                onRecipeUpdated={load}
                />
            )}

            {deleteRecipe && (
                <ConfirmDeleteModel
                recipeName={deleteRecipe.name}
                onClose={() => setDeleteRecipe(null)}
                onConfirm={confirmDelete}
                />
            )}
        </div>
    );
}