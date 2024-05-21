import { sign } from "jsonwebtoken";
const secret: string = process.env.JWT_SECRET!;

export const createToken = (id: string): string => {
    const token = sign({ id }, secret);
    return token;
}

export const createExpirationDate = (): Date => {
    const expirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    return expirationDate;
}