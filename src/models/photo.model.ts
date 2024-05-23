import { model, Schema } from 'mongoose';
import { IPhoto } from '../interfaces/IPhoto';

const photoSchema = new Schema<IPhoto>(
    {
        title: String,
        description: String,
        image_url: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true },
);

export const Photo = model<IPhoto>('Photo', photoSchema);
