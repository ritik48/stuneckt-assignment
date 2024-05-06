import { Request } from "express";

interface IUser {
    username: string;
    password: string;
}

// Custom Request to add user property in the Request after authentication
interface CustomRequest extends Request {
    user?: string;
}

export { IUser, CustomRequest };
