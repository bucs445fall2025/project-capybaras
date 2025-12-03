import axios from "axios";
const BASE_URL = 'http://localhost:5000'; 

const API = axios.create(
  {
    baseURL: BASE_URL,
  }
);

/*
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
*/

export const fetchRecipes = async () =>
{
  const res = await API.get("/recipes");
  return res.data;
};

// export const getAllRecipes = () => API.get("/recipes");

export const getRandomRecipes = async (limit = 20) => 
{
  const res = await API.get("/recipes/random",
    {
      params:
      {
        limit
      }
    }
  );
  return res.data;
};

export const createRecipe = async (data) =>
{
  const res = await API.post("/recipes", data);
  return res.data;
};

export const deleteRecipe = async (recipeId, authorId) =>
{
  const res = await API.delete(`/recipes/${recipeId}`,
    {
      data:
      {
        authorId
      }
    }
  );
  return res.data;
};

export const updateRecipe = async (id, data) =>
{
  const res = await API.put(`/recipes/${id}`, data);
  return res.data;
};

export const searchRecipes = async (name, filters = [], sortBy = "relevance", order = "desc") =>
{
  const params =
  {
    name, sortBy, order
  };

  if(filters.length > 0)
  {
    params.filter = filters.join(",");
  }

  const res = await API.get("/recipes/search", {params});
  return res.data;
};

export const searchExternalRecipes = async (query) =>
{
  const res = await API.get("/api/external/search",
    {
      params:
      {
        query
      }
    }
  );
  return res.data;
};

export const createUser = async (data) =>
{
  const res = await API.post("/users", data);
  return res.data;
};

export const getUser = async (id) =>
{
  const res = await API.get(`/users/${id}`);
  return res.data;
};

export const getUserUsername = async (username) =>
{
  const res = await API.get(`/users/username/${username}`);
  return res.data;
};

export const saveRecipe = async (userId, recipeId) =>
{
  const res = await API.put(`/users/${userId}/saves`,
    {
      recipeId
    }
  );
  return res.data;
};

export const removeSaved = async (userId, recipeId) =>
{
  const res = await API.delete(`/users/${userId}/saves`,
    {
      data:
      {
        recipeId
      }
    }
  );
  return res.data;
}

export const createCollection = async (userId, name, description = "") =>
{
  const res = await API.post(`/users/${userId}/collections`,
    {
      name, description
    }
  );
  return res.data;
};

export const deleteCollection = async(userId, collectionName) =>
{
  const res = await API.delete(`/users/${userId}/collections/${collectionName}/delete`);
  return res.data;
};

export const addToCollection = async (userId, collectionName, recipeId) =>
{
  const res = await API.put(`/users/${userId}/collections/${collectionName}`,
    {
      recipeId
    }
  );
  return res.data;
};

export const removeFromCollection = async (userId, collectionName, recipeId) =>
{
  const res = await API.delete(`/users/${userId}/collections/${collectionName}`,
    {
      data:
      {
        recipeId
      }
    }
  );
  return res.data;
};

export default API