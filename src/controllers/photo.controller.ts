import { Response, NextFunction } from "express";
import { IRequestWithUser } from "../interfaces/IRequestWithUser";
import { errorHandler } from "../utils/error";
import { User } from "../models/user.model";
import { Photo } from "../models/photo.model";
import { IPhoto } from "../interfaces/IPhoto";

export const createPhoto = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const { title, description, image_url } = req.body;
    const loggedUser = req.loggedUser!;

    if (!image_url) {
        return next(errorHandler(400, 'Image_url is required'));
    }

    try {
        const userExists = await User.findById(loggedUser.id);

        if (!userExists) {
            return next(errorHandler(404, 'User not found'));
        }

        const newPhoto: IPhoto = new Photo({
            title,
            description,
            image_url,
            user_id: userExists._id,
        });

        await newPhoto.save();

        return res.status(201).json(newPhoto);

    } catch (error) {
        return next(error);
    }
};