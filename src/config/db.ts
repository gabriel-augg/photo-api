import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const db = async () => {
    const mongoURI: string = process.env.MONGO_URI!;
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to database');
    } catch (error) {
        console.error('Error connecting to database: ', error);
    }
};

export default db;
