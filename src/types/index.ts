import { Request } from "express";

interface IUser {
    username: string;
    password: string;
}

interface CustomRequest extends Request {
    user?: string;
}

export { IUser, CustomRequest };
