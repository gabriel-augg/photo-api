import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import db from './config/db';

dotenv.config();

const port = process.env.PORT!;
const app = express();

app.use(express.json());

app.listen(port, async () => {
    console.log('Server running on port 3000');
    await db();
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({ message });
})
