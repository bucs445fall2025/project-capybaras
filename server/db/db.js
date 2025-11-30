import mongoose from 'mongoose';

export const recipesDB = mongoose.createConnection(process.env.RECIPES_MONGO_URI);
recipesDB.on('connected', () => console.log('Connected to RECIPES_DB'));
recipesDB.on('error', (err) => console.error('Error connecting to RECIPES_DB:', err));

export const usersDB = mongoose.createConnection(process.env.USERS_MONGO_URI);
usersDB.on('connected', () => console.log('Connected to USERS_DB'));
usersDB.on('error', (err) => console.error('Error connecting to USERS_DB:', err));
