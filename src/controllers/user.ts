import express, { NextFunction, Response } from "express";

import { CustomRequest } from "../types";
import { ApiError } from "../utils/ApiError";
import { catchError } from "../utils/catchError";
import { User } from "../models/user";
import { generateJWTToken } from "../utils/auth";

// GET CURRENT LOGGED IN USE
const getCurrentUser = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        res.status(200).json({ success: true, user: req.user });
    }
);

// GET ANY USER BY ID
const getUser = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(400, "Not a valid user");
        }
        res.status(200).json({ success: true, user });
    }
);

// LOG IN USER
const userLogin = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { username, password }: { username: string; password: string } =
            req.body;

        if (!username) {
            throw new ApiError(400, "Username is required");
        }

        const user = await User.findOne({ username });
        if (!user) {
            throw new ApiError(400, "Invalid credentials");
        }
        const isValidPassword = await user.isValidPassword(password);
        if (!isValidPassword) {
            throw new ApiError(400, "Invalid credentials");
        }

        const jwtToken = generateJWTToken(user._id);

        res.cookie("jwt", jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        res.status(200).json({
            success: true,
            message: "User logged in",
            user,
        });
    }
);

// CREATE NEW USER
const userSignup = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { username, password }: { username: string; password: string } =
            req.body;

        if (!username) {
            throw new ApiError(400, "Username is required");
        }

        const user = await User.findOne({ username });
        if (user) {
            throw new ApiError(
                400,
                "Username already taken. Choose something else."
            );
        }

        const newUser = await User.create({ username, password });

        const jwtToken = generateJWTToken(newUser._id);

        res.cookie("jwt", jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.status(200).json({
            success: true,
            message: "Account created successfully",
            user: newUser,
        });
    }
);

// CREATE NEW USER
const userLogout = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        req.user = null;
        res.clearCookie("jwt", {
            secure: true,
            httpOnly: true,
            sameSite: "none",
        });
        res.status(200).json({
            success: true,
            message: "User logged out",
        });
    }
);

// UPDATE USER DETAILS
const updateUser = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const data = req.body;

        // check if the data is not undefined
        if (!data) {
            throw new ApiError(401, "Please provide the data to update");
        }

        // check if the field user want to update is not empty
        for (let d in data) {
            if (!data[d]) {
                throw new ApiError(401, `${d} cannot be empty`);
            }
        }

        // create a new object with the required updates
        let update: { [key: string]: string } = {};
        for (let d in data) {
            update[d] = data[d];
        }

        const x = await User.findOneAndUpdate({ _id: req.user?._id }, update);

        res.status(201).json({ success: true, message: "User updated" });
    }
);

// GET FOLLOWERS OF A USER
const getFollowers = catchError(
    async (req: CustomRequest, res: Response, next: NextFunction) => {
        const { id } = req.params;

        const user = await User.findById(id);
        if (!user) {
            throw new ApiError(400, "Not a valid user");
        }
        res.status(200).json({ success: true, followers: user.followers });
    }
);

export {
    userLogin,
    userSignup,
    getUser,
    getCurrentUser,
    updateUser,
    getFollowers,
    userLogout,
};
