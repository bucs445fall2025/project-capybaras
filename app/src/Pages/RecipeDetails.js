import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; 
import '../Styles/RecipeDetails.css';
import { fetchRecipes } from '../api';

// Dummy data array for recipes
/*
const DUMMY_RECIPES = [
  { id: 1, title: 'Creamy Tuscan Lobster', imageUrl: 'https://www.foodandwine.com/thmb/js1XrL-_jZHQ7k8Z1He_tayQ6SQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Creamy-Tuscan-Lobster-Pasta-FT-Recipe-0625-4294969f2a074028a5ea2bef81c79ca8.jpg', 
    description: 'A rich and decadent Italian-inspired pasta dish featuring succulent lobster tails, sun-dried tomatoes, and fresh spinach tossed in a creamy parmesan sauce.',
    prepTime: '20 min',
    cookTime: '35 min',
    ingredients: [
      '1 lb Fettuccine',
      '2 Lobster tails (or shrimp/chicken)',
      '1 cup Heavy cream',
      '1/2 cup Grated Parmesan',
      '1/2 cup Sun-dried tomatoes',
      '2 cups Fresh spinach',
      '3 cloves Garlic, minced',
    ],
  },
  { id: 2, title: 'Garlic Shrimp in Tomato Sauce', imageUrl: 'https://www.foodandwine.com/thmb/xOs2w7R_qbW5EhJHs0UFQq-cqug=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Garlic-shrimp-in-tomato-sauce-FT-RECIPE0424-efd976fab22444e69c7f5b469d5aadd3.jpg' },
  { id: 3, title: 'Cheesy Rice and Bean Bake', imageUrl: 'https://www.twopeasandtheirpod.com/wp-content/uploads/2024/04/Cheesy-Bean-and-Rice-Skillet-3175.jpg' },
  { id: 4, title: '', imageUrl: 'placeholder-4.jpg' },
  { id: 5, title: '', imageUrl: 'placeholder-5.jpg' },
  { id: 6, title: '', imageUrl: 'placeholder-6.jpg' },
  { id: 7, title: '', imageUrl: 'placeholder-7.jpg' },
  { id: 8, title: '', imageUrl: 'placeholder-8.jpg' },
  { id: 9, title: '', imageUrl: 'placeholder-9.jpg' },
  { id: 10, title: '', imageUrl: 'placeholder-10.jpg' },
  { id: 11, title: '', imageUrl: 'placeholder-11.jpg' },
  { id: 12, title: '', imageUrl: 'placeholder-12.jpg' },
];
*/

function RecipeDetailPage() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [meta, setMeta] = useState({});
  
  // const recipe = DUMMY_RECIPES.find(r => r.id.toString() === recipeId);

  useEffect(() =>
  {
    async function load()
    {
      try
      {
        const list = await fetchRecipes();
        const found = list.find(r => (r._id || r.id).toString() === recipeId.toString());
        if (found) {
          setRecipe(found);
          parseMeta(found.description);
        }
      }
      catch(err)
      {
        console.error('failed to fetch recipe page', err);
      }
    }
    load();
  }, [recipeId]);

  const parseMeta = (desc) => {
    if (!desc) {
      return;
    }

    const metaObj = {};

    // // total time
    // const totalTimeRegex = desc.match(/takes roughly (\d+)\s*minutes/i);
    // if (totalTimeRegex) {
    //   metaObj.totalTime = `${totalTimeRegex[1]} min`;
    // }

    // serving size
    const servingSizeRegex = desc.match(/serves (\d+)/i);
    if (servingSizeRegex) {
      metaObj.servings = servingSizeRegex[1];
    }

    // cost per serving
    const costPerServingRegex = desc.match(/costs?\s*\$?([\d.]+)/i);
    if (costPerServingRegex) {
      metaObj.costPerServing = costPerServingRegex[1];
    }

    // diets
    const dietRegex = /(gluten free|dairy free|pescatarian|vegan|vegetarian|lacto ovo vegetarian|paleolithic)/gi;
    const diets = [...new Set(desc.match(dietRegex))];
    if (diets.length > 0) {
      metaObj.diets = diets;
    }

    // calories
    const caloriesRegex = desc.match(/(\d+)\s*calories/);
    if (caloriesRegex) {
      metaObj.calories = caloriesRegex[1];
    }

    // protein
    const proteiRegex = desc.match(/(\d+)g of protein/);
    if (proteiRegex) {
      metaObj.protein = proteiRegex[1];
    }

    // fat
    const fatRegex = desc.match(/(\d+)g of fat/);
    if (fatRegex) {
      metaObj.fat = fatRegex[1];
    }

    // spoonacular score
    const scoreRegegx = desc.match(/spoonacular score of (\d+)%/i);
    if (scoreRegegx) {
      metaObj.spoonacularScore = scoreRegegx[1];
    }

    setMeta(metaObj);
  };

  if (!recipe) {
    return (
      <div className="detail-container" style={{ textAlign: 'center' }}>
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
    description,
    totalTime,
    ingredients,
    instructions,
    sourceUrl,
    sourceName
  } = recipe;

  return (
    <div className="detail-container">
      
      {/* Header */}
      <h1 className="detail-title">{name}</h1>

      {/* image */}
      {(imagePath || imageUrl || image) && (
        <img 
          src={imagePath || imageUrl || image} 
          alt={name} 
          className="detail-image"
        />
      )}

      {/* meta info */}
      <div className="detail-meta-box">
        {/* {meta.totalTime && <p><strong>Total Time:</strong> {meta.totalTime}</p>} */}
        {meta.servings && <p><strong>Servings:</strong> {meta.servings}</p>}
        {meta.calories && <p><strong>Calories:</strong> {meta.calories}</p>}
        {meta.protein && <p><strong>Protein:</strong> {meta.protein}g</p>}
        {meta.fat && <p><strong>Fat:</strong> {meta.fat}g</p>}
        {meta.costPerServing && <p><strong>Cost per serving:</strong> ${meta.costPerServing}</p>}
        {meta.diets && meta.diets.length > 0 && (<p><strong>Diets:</strong> {meta.diets.join(', ')}</p>)}
        {meta.spoonacularScore && <p><strong>Spoonacular Score:</strong> {meta.spoonacularScore}%</p>}
      </div>

      {/* description */}
      {description && (
        <p className="detail-description" dangerouslySetInnerHTML={{ __html: description }} />
      )}

      {/* ingredients list */}
      {ingredients && ingredients.length > 0 && (
        <>
          <h3 className="detail-ingredients-heading">Ingredients</h3>
          <ul className="detail-ingredients-list">
            {ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </>
      )}

      {/* instructions section */}
      {instructions && (
        <>
          <h3 className="detail-section-title">Instructions</h3>
          <ol className="detail-instructions-list">
            {/*
            {instructions.split(/\n|\. /).filter(Boolean).map((step, index) => (
              <li key={index}>{step.trim()}</li>
            ))}
            */}
            {(Array.isArray(instructions) ? instructions.join('\n') : instructions || '')
              .split(/\n|\. /)
              .filter(Boolean)
              .map((step, index) => (
                <li key={index}>{step.trim()}</li>
              ))}
          </ol>
        </>
      )}

      {/* source */}
      {sourceUrl && (
        <p className="detail-source">
          Recipe source: <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{sourceName || sourceUrl}</a>
        </p>
      )}
    </div>
  );
}

export default RecipeDetailPage;