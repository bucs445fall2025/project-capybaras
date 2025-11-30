// Converts Spoonacular API recipes into your internal Recipe schema format

export function convertSpoonacularRecipe(apiRecipe) {
  return {
    name: apiRecipe.title,
    description: apiRecipe.summary || "",
    likes: apiRecipe.aggregateLikes || 0,

    // Images
    imagePath: apiRecipe.image || apiRecipe.imageUrl || "",

    author: apiRecipe.creditsText || "Unknown",

    // Tags
    tags: apiRecipe.dishTypes || [],

    // Ingredients
    ingredients: apiRecipe.extendedIngredients
      ? apiRecipe.extendedIngredients.map(i => i.original)
      : [],

    // Instructions
    instructions: apiRecipe.instructions || "No instructions provided.",

    // Time info
    preparationTime: apiRecipe.preparationMinutes
      ? `${apiRecipe.preparationMinutes} minutes`
      : null,

    cookTime: apiRecipe.cookingMinutes
      ? `${apiRecipe.cookingMinutes} minutes`
      : null
  };
}
