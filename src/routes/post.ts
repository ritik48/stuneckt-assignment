import express, { NextFunction, Response } from "express";

import { CustomRequest } from "../types";
import { ApiError } from "../utils/ApiError";
import { catchError } from "../utils/catchError";
import { User } from "../models/user";
import { Post } from "../models/post";

const router = express.Router();

router.get(
    "/",
    catchError(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const posts = await Post.find();
            res.status(200).json({ success: true, posts });
        }
    )
);

router.get(
    "/:id",
    catchError(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                throw new ApiError(400, "Not a valid user");
            }
            const posts = await Post.find({ author: user._id });
            res.status(200).json({ success: true, posts });
        }
    )
);

export { router };
