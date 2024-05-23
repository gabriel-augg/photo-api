import { Document, Types } from 'mongoose';

export interface IPhoto extends Document {
    _id: string;
    title?: string;
    description?: string;
    image_url: string;
    user_id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}