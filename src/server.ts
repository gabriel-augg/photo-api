import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import db from './config/db';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';
import photoRoutes from './routes/photo.route';

dotenv.config();

const { NODE_ENV, PORT } = process.env;

let env: string = NODE_ENV!;
let server: any;

const port = PORT!;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/photos', photoRoutes);


if (env === 'test') {
    server = app.listen(0);
} else {
    db().then(() => {
        console.log(`Connected to ${env} database successfully`);
        server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    });
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({ message });
});

export { app, server };
