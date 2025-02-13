import 'dotenv/config';
import morgan from 'morgan';
import express from 'express';
import mongoose from 'mongoose';

mongoose.set('debug', true); // Habilitar depuración

const app = express();
const DB_URL = process.env.NODE_ENV === 'test' ? 'mongodb://192.168.1.203:27017/ticketing-db-test' //Utilizando IPv4 del PC
: process.env.DB_URL || 'mongodb://192.168.1.203:27017/ticketing-db';

mongoose.connect(DB_URL)
    .then(() => {console.log(`Connected to ${DB_URL} DB`)})
    .catch( (err) => console.error('Failed to connect with database. Error:', err.message))

app.use(morgan("dev")); //Middlegare Morgan (Display on terminal)
app.use(express.json()); //Middlegare JSON

app.get("/", (req, res) => {
    res.send("<h1>Ticketing API Rest</h1>");
})

export default app;