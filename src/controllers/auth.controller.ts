import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { errorHandler } from '../utils/error';
import bcryptjs from 'bcryptjs';
import { createExpirationDate, createToken, createPassword, createUsername } from '../utils';
import { IUser } from '../interfaces/IUser';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { name, username, avatarUrl, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
        return next(errorHandler(400, 'Please fill in all fields'));
    }

    try {
        const userExists: IUser | null = await User.findOne({ $or: [{ username }, { email }] });

        if (userExists) {
            return next(errorHandler(400, 'Username or email already in use'));
        }

        if (password !== confirmPassword) {
            return next(errorHandler(400, 'Passwords do not match'));
        }

        const hashPassword: string = await bcryptjs.hash(password, 10);

        const user: IUser = new User({
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
        const user: IUser | null = await User.findOne({ $or: [{ email }, { username }] });

        if (!user) {
            return next(errorHandler(400, 'Invalid credentials'));
        }

        const isMatch: boolean = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return next(errorHandler(400, 'Invalid credentials'));
        }

        const token: string = createToken(user._id.toString());
        const expiryDate: Date = createExpirationDate();

        const { password: _, ...userWithoutPassword } = user.toObject<IUser>();

        res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
};

export const google = async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, avatarUrl } = req.body;

    if (!email) {
        return next(errorHandler(422, "it was not possible to login with Google's account"));
    }

    try {
        const user: IUser | null = await User.findOne({ email });

        if (user) {
            const token: string = createToken(user._id.toString());
            const expiryDate: Date = createExpirationDate();

            const { password: _, ...userWithoutPassword } = user.toObject<IUser>();

            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                .status(200)
                .json({ ...userWithoutPassword });
        } else {
            const password: string = createPassword();
            const username: string = createUsername(name);

            const newUser: IUser = new User({
                name,
                username,
                email,
                avatar_url: avatarUrl,
                password,
            });

            await newUser.save();

            const token: string = createToken(newUser._id.toString());
            const expiryDate: Date = createExpirationDate();

            const { password: __, ...newUserWithoutPassword } = newUser.toObject<IUser>();

            res.cookie('access_token', token, { httpOnly: true, expires: expiryDate })
                .status(201)
                .json(newUserWithoutPassword);
        }
    } catch (error) {
        next(error);
    }
};

export const signOut = async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('access_token').status(200).json({ message: 'User signed out successfully' });
};
