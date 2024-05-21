import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { errorHandler } from '../utils/error';
import bcryptjs from 'bcryptjs';
import { createExpirationDate, createToken } from '../utils';

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
        return next(error);
    }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
        return next(errorHandler(400, 'Please fill in all fields'));
    }

    try {
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (!user) {
            return next(errorHandler(400, 'Invalid credentials'));
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return next(errorHandler(400, 'Invalid credentials'));
        }

        const token = createToken(user._id.toString());
        const expiryDate = createExpirationDate();

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json({ ...userWithoutPassword });
    } catch (error) {
        next(error);
    }
};
