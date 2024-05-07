import jwt, { JwtPayload } from "jsonwebtoken";
import { CustomRequest } from "../types";
import { NextFunction, Response } from "express";
import { ApiError } from "./ApiError";
import { User } from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";

const isAuthenticated = async (
    req: CustomRequest,
    res: Response,
    next: NextFunction
) => {
    // check if cookie is present in the request
    const cookie = req.cookies.jwt;
    if (!cookie) {
        throw new ApiError(401, "You are not authenticated");
    }

    // verify the cookie and get the user Id
    let decodedData: JwtPayload;
    try {
        decodedData = jwt.verify(cookie, JWT_SECRET) as JwtPayload;
    } catch (error) {
        throw new ApiError(401, "Token Expired. Please login again.");
    }

    const user = await User.findById(decodedData.id).select("-password");
    if (user === null) {
        throw new ApiError(401, "Invalid request. User does not exists.");
    }
    req.user = user;

    next();
};

const generateJWTToken = (userId: string) => {
    try {
        const token = jwt.sign({ id: userId }, JWT_SECRET, {
            expiresIn: "60s",
        });

        return token;
    } catch (error) {
        throw new Error("Something went wrong while generating the token");
    }
};

export { generateJWTToken, isAuthenticated };
