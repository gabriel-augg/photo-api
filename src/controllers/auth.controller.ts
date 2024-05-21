import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { errorHandler } from '../utils/error';
import bcryptjs from 'bcryptjs';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, avatarUrl, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return next(errorHandler(400, 'Please fill in all fields'));
    }

    try {
        const userExists = await User.findOne({ $or: [{ username }, { email }] });

        if (userExists) {
            return next(errorHandler(400, 'Username or email already in use'));
        }

        if (password !== confirmPassword) {
            return next(errorHandler(400, 'Passwords do not match'));
        }

        const hashPassword = await bcryptjs.hash(password, 10);

        const user = new User({
            name,
            username,
            avatar_url: avatarUrl,
            email,
            password: hashPassword,
        });

        await user.save();

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        return next(errorHandler(500, 'Internal Server Error'));
    }
};
