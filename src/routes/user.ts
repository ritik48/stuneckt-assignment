import express, { NextFunction, Response } from "express";

import { catchError } from "../utils/catchError";
import { isAuthenticated } from "../utils/auth";
import {
    getUser,
    getCurrentUser,
    userLogin,
    userSignup,
    updateUser,
    getFollowers,
} from "../controllers/user";

const router = express.Router();

router.get("/", catchError(isAuthenticated), getCurrentUser);
router.patch("/", catchError(isAuthenticated), updateUser);
router.post("/login", userLogin);
router.post("/signup", userSignup);
router.get("/:id", getUser);
router.get("/:id/followers", getFollowers);

export { router };
