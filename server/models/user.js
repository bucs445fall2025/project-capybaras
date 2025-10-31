import mongoose from 'mongoose';
import usersDB from '../db/userdb.js';

const userSchema = new mongoose.Schema(
    {
        username: String,
        created: String,
        favorites: [String],
        collections: [String]
    }
);

const User = usersDB.model('User', userSchema);
export default User;