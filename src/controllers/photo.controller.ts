import { Request, Response, NextFunction } from 'express';
import { IRequestWithUser } from '../interfaces/IRequestWithUser';
import { errorHandler } from '../utils/error';
import { User } from '../models/user.model';
import { Photo } from '../models/photo.model';
import { IPhoto } from '../interfaces/IPhoto';
import { IUser } from '../interfaces/IUser';
import mongoose from 'mongoose';

export const getAllPhotos = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const photos: IPhoto[] = await Photo.find().populate('user', '_id username avatar_url');

        return res.status(200).json(photos);
    } catch (error) {
        return next(error);
    }

}

export const getUserPhotosById = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const user: IUser | null = await User.findById(id);

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const photos: IPhoto[] = await Photo.find({ user: id }).populate('user', '_id username avatar_url');

        return res.status(200).json(photos);
    } catch (error) {
        return next(error);
    }
}

export const getPhoto = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const photo: IPhoto | null = await Photo.findById(id).populate('user', '_id username avatar_url');

        if (!photo) {
            return next(errorHandler(404, 'Photo not found'));
        }

        return res.status(200).json(photo);
    } catch (error) {
        return next(error);
    }
};

export const createPhoto = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { title, description, image_url } = req.body;
    const loggedUser = req.loggedUser!;

    if (!image_url) {
        return next(errorHandler(400, 'Image_url is required'));
    }


    try {
        const userExists: IUser | null = await User.findById(loggedUser.id);

        if (!userExists) {
            return next(errorHandler(404, 'User not found'));
        }

        if(userExists._id.toString() !== loggedUser.id) {
            return next(errorHandler(403, 'You can only create photos for your own account'));
        }

        const newPhoto: IPhoto = new Photo({
            title,
            description,
            image_url,
            user: userExists._id,
        });

        await newPhoto.save();

        await User.findByIdAndUpdate(userExists._id, { $push: { photos: newPhoto._id } });

        return res.status(201).json(newPhoto);
    } catch (error) {
        return next(error);
    }
};

export const updatePhoto = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const loggedUser = req.loggedUser!;

    try {
        const photo: IPhoto | null = await Photo.findById(id);

        if (!photo) {
            return next(errorHandler(404, 'Photo not found'));
        }

        if (photo.user.toString() !== loggedUser.id) {
            return next(errorHandler(403, 'You can only update your own photos'));
        }

        const updatedPhoto: IPhoto | null = await Photo.findByIdAndUpdate(id, { title, description }, { new: true });

        return res.status(200).json(updatedPhoto);

    } catch (error) {
        return next(error);
    }
}

export const deletePhoto = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const loggedUser = req.loggedUser!;


    try {
        const photo: IPhoto | null = await Photo.findById(id);

        if (!photo) {
            return next(errorHandler(404, 'Photo not found'));
        }

        if (photo.user.toString() !== loggedUser.id) {
            return next(errorHandler(403, 'You can only delete your own photos'));
        }

        await Photo.findByIdAndDelete(id);
        await User.findByIdAndUpdate(photo.user, { $pull: { photos: id } });

        return res.status(204).json();

    } catch (error) {
        return next(error);
    }
}
