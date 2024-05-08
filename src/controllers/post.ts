import { NextFunction, Response } from "express";

import { CustomRequest } from "../types";
import { ApiError } from "../utils/ApiError";
import { catchError } from "../utils/catchError";
import { User } from "../models/user";
import { Post } from "../models/post";

// GET ALL THE POSTS
const getAllPosts = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const posts = await Post.find();
        res.status(200).json({ success: true, posts });
    }
);

// CREATE NEW POST
const createPost = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { content }: { content: string } = req.body;

        const newPost = await Post.create({
            content,
            author: req.user?._id,
        });

        res.status(201).json({
            success: true,
            message: "Post created",
            post: newPost,
        });
    }
);

// GET POST OF A PARTICULAR USER
const getPost = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(400, "Not a valid user");
        }
        const posts = await Post.find({ author: user._id });
        res.status(200).json({ success: true, posts });
    }
);

export { getAllPosts, createPost, getPost };
