import express, { NextFunction, Response } from "express";

import { CustomRequest } from "../types";
import { ApiError } from "../utils/ApiError";
import { catchError } from "../utils/catchError";
import { User } from "../models/user";
import { generateJWTToken, isAuthenticated } from "../utils/auth";
import { JwtPayload, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";

const router = express.Router();

router.post(
    "/login",
    catchError(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const {
                username,
                password,
            }: { username: string; password: string } = req.body;

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

            res.cookie("jwt", jwtToken);
            res.status(200).json({ success: true, message: "User logged in" });
        }
    )
);

router.post(
    "/signup",
    catchError(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const {
                username,
                password,
            }: { username: string; password: string } = req.body;

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

            res.status(200).json({
                success: true,
                message: "Account created successfully",
                user: newUser,
            });
        }
    )
);

router.get(
    "/",
    catchError(isAuthenticated),
    catchError(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            res.status(200).json({ status: true, user: req.user });
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
            res.status(200).json({ success: true, user });
        }
    )
);

router.get(
    "/:id/followers",
    catchError(
        async (req: CustomRequest, res: Response, next: NextFunction) => {
            const { id } = req.params;

            const user = await User.findById(id);
            if (!user) {
                throw new ApiError(400, "Not a valid user");
            }
            res.status(200).json({ success: true, followers: user.followers });
        }
    )
);

export { router };
