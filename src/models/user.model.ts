import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    name: String,
    username: {
        type: String,
        required: true,
        unique: true,
    },
    avatar_url: {
        type: String,
        default:
            'https://firebasestorage.googleapis.com/v0/b/photohub-cfe59.appspot.com/o/nophoto.png?alt=media&token=86eb1838-d578-4459-9948-ef33a87f6692',
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

export const User = model('User', userSchema);
