import React, { useState } from "react";
import RecipeCard from "../Components/RecipeCard";
import { fetchRecipes, saveRecipe, searchExternalRecipes } from "../api";

function Search({ userId, folders }) {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e && e.preventDefault();
    if (!query) return;
    setLoading(true);
    //const results = await fetchRecipes(query);
    //setRecipes(results);
    //setLoading(false);
    try {
      const results = await searchExternalRecipes(query);
      setRecipes(results);
    }
    catch(err)
    {
      console.error(err);
      setRecipes([]);
    }
    finally
    {
      setLoading(false);
    }
  };

  const handleSave = async (recipe, folderId) => {
    //const folderName = folders.find(f => f.id === folderId)?.name;
    //await saveRecipe(userId, recipe, folderName);
    //alert(`Saved "${recipe.title}" to folder "${folderName}"`);
    alert('Use the save button on the card to save to a folder.');
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
            key={recipe.id || recipe._id}
            recipe={{
              id: recipe.id,
              title: recipe.title || recipe.name,
              name: recipe.name || recipe.title,
              image: recipe.image || recipe.imageUrl,
              imageUrl: recipe.imageUrl || recipe.image,
              ingredients: recipe.extendedIngredients ? recipe.extendedIngredients.map(i => i.originalString || i.name) : (recipe.ingredients || []),
              instructions: recipe.instructions || recipe.summary || "",
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
