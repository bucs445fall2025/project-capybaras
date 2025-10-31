import mongoose from 'mongoose';

const recipesDB = mongoose.createConnection(process.env.RECIPES_MONGO_URI);

recipesDB.on('connected', () => console.log('Connected to RECIPES_DB'));
recipesDB.on('error', (err) => console.error('Error connecting to RECIPES_DB: ', err));

export default recipesDB;