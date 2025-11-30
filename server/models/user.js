import mongoose from 'mongoose';
import { usersDB } from '../db/db.js';
import { recipesDB } from '../db/db.js';
import { recipeSchema } from './recipe.js';

const RecipeOnUserDB = usersDB.model('Recipe', recipeSchema);

const userSchema = new mongoose.Schema(
    {
        username:
        {
            type: String,
            required: true,
            unique: true
        },
        joined: 
        {
            type: Date,
            default: Date.now
        },
        created: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'
            }
        ],
        saves: [
            {
                type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'
            }
        ],
        collections: [
            {
                name:
                {
                    type: String,
                    required: true
                },
                description:
                {
                    type: String,
                    default: ''
                },
                recipes: [
                    {
                        type: mongoose.Schema.Types.ObjectId, ref: 'Recipe'
                    }
                ]
            }
        ]
    }
);

const User = usersDB.model('User', userSchema);
export default User;