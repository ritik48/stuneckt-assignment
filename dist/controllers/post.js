"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPost = exports.createPost = exports.getAllPosts = void 0;
const ApiError_1 = require("../utils/ApiError");
const catchError_1 = require("../utils/catchError");
const user_1 = require("../models/user");
const post_1 = require("../models/post");
// GET ALL THE POSTS
const getAllPosts = (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let page = (_a = req.query["page"]) !== null && _a !== void 0 ? _a : "1";
    let limit = (_b = req.query["limit"]) !== null && _b !== void 0 ? _b : "2";
    let posts;
    if (!page ||
        !limit ||
        isNaN(parseInt(page)) ||
        page[0] === "-" ||
        limit[0] === "-" ||
        isNaN(parseInt(limit))) {
        posts = yield post_1.Post.find().populate("author", "-password");
    }
    else {
        const offset = (parseInt(page) - 1) * parseInt(limit);
        posts = yield post_1.Post.find()
            .skip(offset)
            .limit(parseInt(limit))
            .populate("author", "-password");
    }
    const totalDocuments = yield post_1.Post.find().countDocuments();
    res.status(200).json({ success: true, posts, total: totalDocuments });
}));
exports.getAllPosts = getAllPosts;
// CREATE NEW POST
const createPost = (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const { content } = req.body;
    const newPost = yield post_1.Post.create({
        content,
        author: (_c = req.user) === null || _c === void 0 ? void 0 : _c._id,
    });
    res.status(201).json({
        success: true,
        message: "Post created",
        post: newPost,
    });
}));
exports.createPost = createPost;
// GET POST OF A PARTICULAR USER
const getPost = (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.ApiError(400, "Not a valid user");
    }
    const posts = yield post_1.Post.find({ author: user._id }).populate("author", "-password");
    res.status(200).json({ success: true, posts });
}));
exports.getPost = getPost;
