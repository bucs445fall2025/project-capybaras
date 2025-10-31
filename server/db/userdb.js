import mongoose from 'mongoose';

const usersDB = mongoose.createConnection(process.env.USERS_MONGO_URI);

usersDB.on('connected', () => console.log('Connected to USERS_DB'));
usersDB.on('error', (err) => console.error('Error connecting to USERS_DB: ', err));

export default usersDB;