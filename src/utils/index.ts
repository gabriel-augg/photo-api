import { sign } from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const secret: string = process.env.JWT_SECRET!;

export const createToken = (id: string): string => {
    const token = sign({ id }, secret);
    return token;
};

export const createExpirationDate = (): Date => {
    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    return expirationDate;
};

export const createPassword = (): string => {
    const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
    const hashedPassword = bcryptjs.hashSync(password, 10);
    return hashedPassword;
};

export const createUsername = (name: string): string => {
    const username = name.split(' ').join('').toLowerCase() + Math.floor(Math.random() * 10000).toString();
    return username;
};
