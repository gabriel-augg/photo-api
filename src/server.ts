import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import db from './config/db';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route';
import userRoutes from './routes/user.route';

dotenv.config();

const { NODE_ENV, PORT } = process.env;

const port = PORT!;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

let server: any;

if (NODE_ENV !== 'test') {
    db().then(() => {
        console.log('Database connected successfully');
        server = app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    });
} else {
    server = app.listen(0, () => {
        console.log('Server is running in test mode');
    });
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({ message });
});

export { app, server };
