import { NextFunction, Response } from "express";
import { CustomRequest } from "../types";

export const catchError = (
    fn: (req: CustomRequest, res: Response, next: NextFunction) => Promise<void>
) => {
    return async (req: CustomRequest, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};
