import express from 'express';
import cors from 'cors';
import User from './models/user.js';
import Recipe from './models/recipe.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => 
{
  res.send('Backend operation is normal' );
}
);

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
app.post('/recipes', async (req, res) => 
{
  try
  {
    const newRecipe = new Recipe(req.body);
    const result = await newRecipe.save();
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
    const id = req.params.id;
    const updateData = req.body;

    const updatedRecipe = await Recipe.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

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