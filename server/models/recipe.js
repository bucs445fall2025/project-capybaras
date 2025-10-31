import mongoose from 'mongoose';
import recipesDB from '../db/recipedb.js';

const recipeSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true
        },
        decription: String,
        likes:
        {
            type: Number,
            default: 0
        },
        imagePath: String,
        author: String,
        tags: [String],
        ingredients: [String],
        instructions: String,
        creationDate:
        {
            type: Date,
            default: Date.now
        },
        restrictions: [String],
        preparationTime: String,
        cookTime: String
    }
);

recipeSchema.index(
    {
        name: 'text'
    }
);

const Recipe = recipesDB.model('Recipe', recipeSchema);
export default Recipe;