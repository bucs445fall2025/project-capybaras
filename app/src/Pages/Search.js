import React, { useState } from "react";
import RecipeCard from "../Components/RecipeCard";
import { fetchRecipes, saveRecipe } from "../api";

function Search({ userId, folders }) {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const results = await fetchRecipes(query);
    setRecipes(results);
    setLoading(false);
  };

  const handleSave = async (recipe, folderId) => {
    const folderName = folders.find(f => f.id === folderId)?.name;
    await saveRecipe(userId, recipe, folderName);
    alert(`Saved "${recipe.title}" to folder "${folderName}"`);
  };

  return (
    <div className="search-page">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search recipes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}

      <div className="recipe-grid-container">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={{
              id: recipe.id,
              title: recipe.title,
              imageUrl: recipe.image,
              ingredients: recipe.extendedIngredients || [],
              instructions: recipe.instructions || "",
            }}
            onSave={handleSave}
            folders={folders}
          />
        ))}
      </div>
    </div>
  );
}

export default Search;
