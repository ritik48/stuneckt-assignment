import { NextFunction, Response } from "express";

import { CustomRequest } from "../types";
import { ApiError } from "../utils/ApiError";
import { catchError } from "../utils/catchError";
import { User } from "../models/user";
import { Post } from "../models/post";

// GET ALL THE POSTS
const getAllPosts = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        let page = (req.query["page"] as string | undefined) ?? "1";
        let limit = (req.query["limit"] as string | undefined) ?? "2";

        let posts;
        if (
            !page ||
            !limit ||
            isNaN(parseInt(page)) ||
            page[0] === "-" ||
            limit[0] === "-" ||
            isNaN(parseInt(limit))
        ) {
            posts = await Post.find().populate("author", "-password");
        } else {
            const offset = (parseInt(page) - 1) * parseInt(limit);
            posts = await Post.find()
                .skip(offset)
                .limit(parseInt(limit))
                .populate("author", "-password");
        }

        const totalDocuments = await Post.find().countDocuments();

        res.status(200).json({ success: true, posts, total: totalDocuments });
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
        const posts = await Post.find({ author: user._id }).populate("author", "-password");
        res.status(200).json({ success: true, posts });
    }
);

export { getAllPosts, createPost, getPost };
