import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import RecipeCard from "../Components/RecipeCard";
import { searchExternalRecipes, searchRecipes } from "../api";
import "../Styles/ConfigBox.css";

function Search({ selectedFilters, selectedSort, selectedOrder }) {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get('q') || "";

  const handleSearch = async (e, qu = query) => {
    e?.preventDefault();
    if (!qu)
    {
      return;
    }

    try
    {
      const localResults = await searchRecipes(qu, selectedFilters, selectedSort, selectedOrder);
      const externalResults = await searchExternalRecipes(qu);
      const combined = [...localResults, ...externalResults].filter((a, index, self) => self.findIndex(r => (r.id || r._id) === (a.id || a._id)) === index);
      setRecipes(combined);
    }
    catch(err)
    {
      console.error(err);
      setRecipes([]);
    }
  };

  useEffect(() =>
  {
    setQuery(initialQuery);
    if(initialQuery)
    {
      handleSearch(null, initialQuery);
    }
  }, [initialQuery, selectedFilters, selectedSort, selectedOrder])

  return (
    <div className="search-page">
      <div className="recipe-grid-container">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id || recipe._id}
            recipe={recipe}
          />
        ))}
      </div>
    </div>
  );

}

export default Search;
