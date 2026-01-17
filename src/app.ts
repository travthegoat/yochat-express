import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// MIDDLEWARE //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true }));

// HEALTH CHECK //
app.get('/health', (req, res) => {
    res.status(200).send('OK');
})

export default app;
