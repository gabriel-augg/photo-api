import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.model';
import { errorHandler } from '../utils/error';
import bcryptjs from 'bcryptjs';

import { IRequestWithUser } from '../interfaces/IRequestWithUser';
import { IUser } from '../interfaces/IUser';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const user: IUser | null = await User.findById(id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password: _, ...userData } = user.toObject<IUser>();

        return res.status(200).json({ ...userData });
    } catch (error) {
        return next(error);
    }
};

export const updateUser = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, username, email, avatarUrl, password, confirmPassword } = req.body;
    const loggedUser = req.loggedUser!;

    if (loggedUser.id !== id) {
        return next(errorHandler(403, 'You can only update your own account'));
    }

    if (!username || !email) {
        return next(errorHandler(400, 'Username and email are required'));
    }

    try {
        const existingUser: IUser | null = await User.findById(id);

        if (!existingUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const usernameExists: IUser | null = await User.findOne({ username });

        if (usernameExists && usernameExists.id !== id) {
            return next(errorHandler(400, 'Username already in use'));
        }

        const emailExists: IUser | null = await User.findOne({ email });

        if (emailExists && emailExists.id !== id) {
            return next(errorHandler(400, 'Email already in use'));
        }

        let newPassword: string = existingUser.password;

        if (password) {
            if (password !== confirmPassword) {
                return next(errorHandler(400, 'Passwords do not match'));
            }

            newPassword = bcryptjs.hashSync(password, 10);
        }

        const updateUser: IUser | null = await User.findByIdAndUpdate(
            id,
            {
                name,
                username,
                email,
                avatarUrl,
                password: newPassword,
            },

            { new: true },
        );

        if (!updateUser) {
            return next(errorHandler(404, 'User not found'));
        }

        const { password: _, ...user } = updateUser.toObject<IUser>();

        return res.status(200).json(user);
    } catch (error) {
        return next(error);
    }
};

export const deleteUser = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const loggedUser = req.loggedUser!;

    if (loggedUser.id !== id) {
        return next(errorHandler(403, 'You can only delete your own account'));
    }

    try {
        const existingUser: IUser | null = await User.findById(id);

        if (!existingUser) {
            return next(errorHandler(404, 'User not found'));
        }

        await User.findByIdAndDelete(id);

        return res.clearCookie('access_token').status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        return next(error);
    }
};
