import mongoose from 'mongoose';
import { recipesDB } from '../db/db.js';

export const recipeSchema = new mongoose.Schema(
    {
        name:
        {
            type: String,
            required: true
        },
        description: String,
        likes:
        {
            type: Number,
            default: 0
        },
        imagePath: String,
        authorId:
        {
            type: mongoose.Schema.Types.ObjectId, ref: "User"
        },
        tags: [String],
        ingredients: [String],
        instructions: [String],
        creationDate:
        {
            type: Date,
            default: Date.now
        },
        restrictions: [String],
        preparationTime: String,
        cookTime: String,
        source:
        {
            type: String, index: true
        },
        sourceId:
        {
            type: String, index: true
        }
    }
);

recipeSchema.index(
    {
        name: 'text'
    }
);

recipeSchema.index(
    {
        tags: 1
    }
);

recipeSchema.index(
    {
        restrictions: 1
    }
);

recipeSchema.index(
    {
        ingredients: 1
    }
);

const Recipe = recipesDB.model('Recipe', recipeSchema);
export default Recipe;