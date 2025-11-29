import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import User from './models/user.js';
import Recipe from './models/recipe.js';

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const SPOON_KEY = process.env.SPOON_KEY;  // Spoonacular API key
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => 
{
  res.send('Backend operation is normal' );
}
);


// external recipe api routes
app.get('/api/external/search', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) {
      return res.status(400).json({ error: "Missing ?query=" });
    }

    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=20&addRecipeInformation=true&apiKey=${SPOON_KEY}`;

    const response = await axios.get(apiUrl);
    res.json(response.data.results); 
  } 
  catch (err) {
    console.error("Spoonacular error:", err.response?.data || err.message);
    res.status(500).json({ error: "External API request failed" });
  }
});


// =============================================================================================================
//                                             RECIPE DATABASE ROUTES
// =============================================================================================================

// GET all recipes
app.get('/recipes', async (req, res) => 
{
  try
  {
    const recipes = await Recipe.find();
    res.json(recipes);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: 'Failed to fetch recipes'
      }
    );
  }
}
);

// GET /recipes/search?name=<name>&filters=<filters>&sortBy=<sort>&order=<type>
// Search by name and optionally with filters and sort method
app.get('/recipes/search', async (req, res) =>
{
  try
  {
    const { name, filters, sortBy = 'relevance', order = 'desc' } = req.query;

    const query = {};

    if(name)
    {
      query.$text =
      {
        $search: name 
      };
    }

    if(filters)
    {
      const filtersArray = Array.isArray(filters) ? filters : filters.split(',');
      query.tags =
      {
        $in: filtersArray
      };
    }

    const sortDirection = order === 'asc' ? 1 : -1;
    let sortOptions;
    if(sortBy === 'relevance' && name)
    {
      sortOptions = {
        score:
        {
          $meta: "textScore"
        }
      };
    }
    else
    {
      sortOptions =
      {
        [sortBy]: sortDirection
      };
    }

    const recipes = await Recipe.find(query, name ?
      {
        score:
        {
          $meta: "textScore"
        }
      } : {}).sort(sortOptions);

    res.json(recipes);
  }
  catch(err)
  {
    console.error('Error search: ', err);
    res.status(500).json(
      {
        error: 'Failed search'
      }
    );
  }
}
);

// POST /recipes/
// Creates a recipe and add it to main database and users individual database of recipes they created
app.post('/recipes', async (req, res) => 
{
  try
  {
    const newRecipe = new Recipe(req.body);
    const result = await newRecipe.save();

    if(req.body.authorId)
    {
      await User.findByIdAndUpdate(
        req.body.authorId,
        {
          $push:
          {
            created: recipe._id
          }
        }
      );
    }

    res.status(201).json(result);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: "failed to save recipe"
      }
    );
  }
}
);

// DELETE /recipes/<id>
// Remove a recipe by from main database and user's created recipes
app.delete('/recipes/:id', async (req, res) =>
{
  try
  {
    const id = req.params.id;
    const deleted = await Recipe.findByIdAndDelete(id);

    if(!deleted)
    {
      return res.status(404).json(
        {
          error: 'Recipe not found'
        }
      );
    }

    await User.updateMany(
      {
        created: id
      },
      {
        $pull:
        {
          created: id
        }
      }
    )
    
    res.json({message: "recipe removed"});
  }
  catch(err)
  {
    console.error('Error removing recipe: ', err);
    res.status(500).json({error: 'Failed to remove recipe'});
  }
}
);

// Update a recipe by id (e.g. likes count)
app.put('/recipes/:id', async (req, res) => {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (!updatedRecipe) {
      return res.status(404).json(
        {
          error: 'Recipe not found'
        }
      );
    }

    res.json(updatedRecipe);
  }
  catch(err) {
    console.error('Error updating recipe: ', err);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
}
);

app.listen(PORT, () =>
{
  console.log(`Server port: ${PORT}`);
}
);

// ============================================================================================================
//                                             USER DATABASE ROUTES
// ============================================================================================================

// POST /users/
// Create a user
// Only a name is necessary, everything else is initialized automatically (id) or an empty array (saves, collections, etc.)
app.post('/users', async (req, res) =>
{
  try
  {
    const user = new User(req.body);
    const result = await user.save();
    res.status(201).json(result);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: 'Failed to create user'
      }
    );
  }
}
);

// GET /users/:id
// Get a users id
// Can temporarily used for associating user to their account and mainly used to check another users profile
app.get('/users/:id', async (req, res) =>
{
  try
  {
    const user = await User.findById(req.params.id)
    .populate('created')
    .populate('saves')
    .populate('collections.recipes');

    if(!user)
    {
      return res.status(404).json(
        {
          error: 'User not found'
        }
      );
    }

    res.json(user);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: 'Failed to fetch user'
      }
    );
  }
}
);

// PUT /users/:id/saves
// Adds recipe to saves
app.put('/users/:id/saves', async (req, res) =>
{
  try
  {
    const { recipeId } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id,
      {
        $addToSet:
        {
          saves: recipeId
        }
      },
      {
        new: true
      }
    );

    res.json(user);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: 'Failed to update saves'
      }
    );
  }
}
);

// POST /users/:id/collections
// Create a collection
app.post('/users/:id/collections', async (req, res) =>
{
  try
  {
    const { name, description } = req.body;

    const user = await User.findByIdAndUpdate(req.params.id,
      {
        $push:
        {
          collections:
          {
            name, description, recipes:[]
          }
        }
      },
      {
        new: true
      }
    );

    res.json(user);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: 'Failed to create collection'
      }
    );
  }
}
);

// PUT /users/:id/collections/:collectionName
// Adds a recipe to specific collection
app.put('/users/:id/collections/:collectionName', async (req, res) =>
{
  try
  {
    const { recipeId } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        "collections.name": req.params.collectionName
      },
      {
        $addToSet:
        {
          "collections.$.recipes": recipeId
        }
      },
      {
        new: true
      }
    );

    res.json(user);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: 'Failed to update collection'
      }
    );
  }
}
);

// DELETE /users/:id/saves
// Remove a recipe from 'saves'
app.delete('/users/:id/saves', async (req, res) =>
{
  try
  {
    const {recipeId} = req.body;

    const user = await User.findByIdAndUpdate(req.params.id,
      {
        $pull:
        {
          saves: recipeId
        }
      },
      {
        new: true
      }
    );

    res.json(user);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: "failed to remove saved recipe"
      }
    );
  }
}
);

// DELETE /users/:id/collections/:collectionName
// Remove recipe from a collection
app.delete('/users/:id/collections/:collectionName', async (req, res) =>
{
  try
  {
    const {recipeId} = req.body;

    const user = User.findOneAndUpdate(
      {
        _id: req.params.id,
        "collections.name": req.params.collectionName
      },
      {
        $pull:
        {
          "collections.$.recipes": recipeId
        }
      },
      {
        new: true
      }
    );

    res.json(user);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: "Failed to remove recipe from collection"
      }
    );
  }
}
);

// DELETE /users/:id/collections/:collectionName/delete
// Delete an entire collection
app.delete('/users/:id/collections/:collectionName/delete', async (req, res) =>
{
  try
  {
    const user = await User.findByIdAndUpdate(req.params.id,
      {
        $pull:
        {
          collections:
          {
            name: req.params.collectionName
          }
        }
      },
      {
        new: true
      }
    );

    res.json(user);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: "Failed to delete collection"
      }
    );
  }
}
);

// PUT /users/:id/collections/:collectionName/edit
// Edit a collections name, description
app.put('/users/:id/collections/:collectionName/edit', async (req, res) =>
{
  try
  {
    const { newName, newDesc } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: req.params.id,
        "collections.name": req.params.collectionName
      },
      {
        $set:
        {
          "collections.$.name": newName,
          "collections.$.description": newDesc
        }
      },
      {
        new: true
      }
    );

    res.json(user);
  }
  catch(err)
  {
    console.error(err);
    res.status(500).json(
      {
        error: "Failed to update collection"
      }
    );
  }
}
);


app.listen(PORT, () => {
  console.log(`Server port: ${PORT}`);
});