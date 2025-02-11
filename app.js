import 'dotenv/config';
import morgan from 'morgan';
import express from 'express';

const app = express();

app.use(morgan("dev")); //Middlegare Morgan
app.use(express.json()); //Middlegare JSON

app.get("/", (req, res) => {
    res.send("<h1>Ticketing API Rest</h1>");
})

export default app;