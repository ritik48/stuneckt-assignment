import express from "express";

import { catchError } from "../utils/catchError";
import { isAuthenticated } from "../utils/auth";
import { createPost, getAllPosts, getPost } from "../controllers/post";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", catchError(isAuthenticated), createPost);
router.get("/:id", getPost);

export { router };
