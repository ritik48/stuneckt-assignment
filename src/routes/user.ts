import express, { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { catchError } from "../utils/catchError";
import { User } from "../models/user";
import { Post } from "../models/post";

const router = express.Router();

router.get(
    "/:id",
    catchError(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(400, "Not a valid user");
        }
        res.status(200).json({ success: true, user });
    })
);

router.get(
    "/:id/followers",
    catchError(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(400, "Not a valid user");
        }
        res.status(200).json({ success: true, followers: user.followers });
    })
);


export { router };
