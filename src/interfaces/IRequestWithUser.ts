import { Request } from 'express';

export interface IRequestWithUser extends Request {
    loggedUser?: { id: string };
}
