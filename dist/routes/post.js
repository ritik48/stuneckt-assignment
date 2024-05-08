"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const catchError_1 = require("../utils/catchError");
const auth_1 = require("../utils/auth");
const post_1 = require("../controllers/post");
const router = express_1.default.Router();
exports.router = router;
router.get("/", post_1.getAllPosts);
router.post("/", (0, catchError_1.catchError)(auth_1.isAuthenticated), post_1.createPost);
router.get("/:id", post_1.getPost);
