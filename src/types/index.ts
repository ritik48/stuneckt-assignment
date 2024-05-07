import { Request } from "express";
import { Document } from "mongoose";

interface IUser {
    username: string;
    password: string;
}

// Custom Request to add user property in the Request after authentication
interface CustomRequest extends Request {
    user?: Document;
}

export { IUser, CustomRequest };
