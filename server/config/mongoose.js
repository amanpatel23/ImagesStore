require('dotenv').config();
const mongoose = require('mongoose');
const urlString = process.env.MONGODB_URL

mongoose.connect(urlString);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error connecting to the database: MONOGODB'));
db.once('open', () => console.log('connected to the database: MONGODB'));

module.exports = db;