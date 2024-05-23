import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGO_URI, MONGO_URI_DEV, NODE_ENV } = process.env;

const dbUri: string = NODE_ENV === 'development' ? MONGO_URI_DEV! : MONGO_URI!;


if (!dbUri) {
    console.error('Mongo URI is required');
    process.exit(1);
}

const db = async () => {
    try {
        await mongoose.connect(dbUri);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export default db;
