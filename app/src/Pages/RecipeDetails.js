import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import '../Styles/RecipeDetails.css';
import { fetchRecipes } from '../api';

function RecipeDetailPage() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [meta, setMeta] = useState({});
  const [checked, setChecked] = useState([]);
 
  // Scroll to top 
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [recipeId]);

  
  // Load recipe data
  useEffect(() => {
    async function load() {
      try {
        const list = await fetchRecipes();
        const found = list.find(r => (r._id || r.id).toString() === recipeId.toString());

        if (found) {
          setRecipe(found);
          parseMeta(found.description || "");
        }
      } catch (err) {
        console.error('failed to fetch recipe page', err);
      }
    }
    load();
  }, [recipeId]);

  const normalizedIngredients = (() => {
    if (!recipe?.ingredients) return [];

    if (Array.isArray(recipe.ingredients)) {
      return recipe.ingredients.map(i => i.toString().trim()).filter(Boolean);
    }
    if (typeof recipe.ingredients === "string") {
      return recipe.ingredients
        .split(/[,•\n]/)
        .map(i => i.trim())
        .filter(Boolean);
    }
    return [];
  })();

  useEffect(() => {
    setChecked(Array(normalizedIngredients.length).fill(false));
  }, [recipe]);

  const toggleIngredient = (index) => {
    setChecked(prev => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const parseMeta = (desc) => {
    const metaObj = {};

    const servingSizeRegex = desc.match(/serves (\d+)/i);
    if (servingSizeRegex) metaObj.servings = servingSizeRegex[1];

    const costPerServingRegex = desc.match(/costs?\s*\$?([\d.]+)/i);
    if (costPerServingRegex) metaObj.costPerServing = costPerServingRegex[1];

    const dietRegex = /(gluten free|dairy free|pescatarian|vegan|vegetarian|lacto ovo vegetarian|paleolithic)/gi;
    const diets = desc.match(dietRegex);
    if (diets) metaObj.diets = [...new Set(diets)];

    const caloriesRegex = desc.match(/(\d+)\s*calories/i);
    if (caloriesRegex) metaObj.calories = caloriesRegex[1];

    const proteinRegex = desc.match(/(\d+)g of protein/i);
    if (proteinRegex) metaObj.protein = proteinRegex[1];

    const fatRegex = desc.match(/(\d+)g of fat/i);
    if (fatRegex) metaObj.fat = fatRegex[1];

    const scoreRegex = desc.match(/spoonacular score of (\d+)%/i);
    if (scoreRegex) metaObj.spoonacularScore = scoreRegex[1];

    setMeta(metaObj);
  };

  const normalizedInstructions = (() => {
    if (!recipe?.instructions) return [];

    let text = "";

    if (Array.isArray(recipe.instructions)) {
      text = recipe.instructions.join(". ");
    } else {
      text = recipe.instructions;
    }

    text = text.replace(/<[^>]*>/g, "");     
    text = text.replace(/\.([A-Z])/g, ". $1"); 

    return text
      .split(/\.\s+|\n+/)
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.replace(/\.$/, "")); 
  })();

  if (!recipe) {
    return (
      <div className="detail-container" style={{ textAlign: "center" }}>
        <h1 className="detail-title">Recipe Not Found</h1>
        <p>The requested recipe ID: {recipeId} does not exist.</p>
      </div>
    );
  }

  const {
    name,
    imagePath,
    imageUrl,
    image,
    description
  } = recipe;

  return (
    <div className="detail-container">
      <div className="recipe-detail-card">
        <h1 className="detail-title">{name}</h1>

        <div className="top-section">
          <img 
            src={imagePath || imageUrl || image} 
            alt={name} 
            className="detail-image"
          />

          <div className="top-meta">
            {meta.servings && <div className="meta-pill">🍽 {meta.servings} servings</div>}
            {meta.calories && <div className="meta-pill">🔥 {meta.calories} cal</div>}
            {meta.protein && <div className="meta-pill">💪 {meta.protein}g protein</div>}
            {meta.fat && <div className="meta-pill">🥑 {meta.fat}g fat</div>}
            {meta.costPerServing && <div className="meta-pill">💲 {meta.costPerServing}/serving</div>}
            {meta.diets && <div className="meta-pill">🌱 {meta.diets.join(", ")}</div>}
          </div>
        </div>

        {/* INGREDIENTS */}
        {normalizedIngredients.length > 0 && (
          <div className="section-card">
            <h3>Ingredients</h3>

            <ul className="ingredients-checklist">
              {normalizedIngredients.map((item, index) => (
                <li key={index} onClick={() => toggleIngredient(index)}>
                  <span className={`checkbox ${checked[index] ? "checked" : ""}`}></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* INSTRUCTIONS */}
        {normalizedInstructions.length > 0 && (
          <div className="section-card">
            <h3>Instructions</h3>
            <ol className="instructions-list">
              {normalizedInstructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeDetailPage;
