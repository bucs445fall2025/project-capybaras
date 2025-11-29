const BASE_URL = 'http://localhost:5000'; 

export async function fetchRecipes() {
  const response = await fetch(`${BASE_URL}/recipes`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch recipes');
  }
  return response.json();
}

export async function updateRecipe(id, updatedRecipe) {
  const response = await fetch(`${BASE_URL}/recipes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedRecipe),
  });

  if (!response.ok) {
    throw new Error('Failed to update recipe');
  }
  return response.json();
}

export async function searchExternalRecipes(query) {
  const response = await fetch(`${BASE_URL}/api/external/search?query=${encodeURIComponent(query)}`);

  if (!response.ok) {
    throw new Error('Failed to search external recipes');
  }
  return response.json();
}
