import { Response, NextFunction } from 'express';
import { IRequestWithUser } from '../interfaces/IRequestWithUser';
import { verify } from 'jsonwebtoken';
import { errorHandler } from './error';

const secret: string = process.env.JWT_SECRET!;

export const verifyToken = (req: IRequestWithUser, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;

    if (!token) {
        return next(errorHandler(401, 'You are not authenticated'));
    }

    verify(token, secret, (error: any, decoded: any) => {
        if (error) {
            return next(errorHandler(403, 'Invalid token'));
        }

        req.loggedUser = decoded;

        next();
    });
};
