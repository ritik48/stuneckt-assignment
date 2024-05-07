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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const ApiError_1 = require("../utils/ApiError");
const catchError_1 = require("../utils/catchError");
const user_1 = require("../models/user");
const auth_1 = require("../utils/auth");
const jsonwebtoken_1 = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";
const router = express_1.default.Router();
exports.router = router;
router.post("/login", (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, } = req.body;
    if (!username) {
        throw new ApiError_1.ApiError(400, "Username is required");
    }
    const user = yield user_1.User.findOne({ username });
    if (!user) {
        throw new ApiError_1.ApiError(400, "Invalid credentials");
    }
    const isValidPassword = yield user.isValidPassword(password);
    if (!isValidPassword) {
        throw new ApiError_1.ApiError(400, "Invalid credentials");
    }
    const jwtToken = (0, auth_1.generateJWTToken)(user._id);
    res.cookie("jwt", jwtToken);
    res.status(200).json({ success: true, message: "User logged in" });
})));
router.post("/signup", (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, } = req.body;
    if (!username) {
        throw new ApiError_1.ApiError(400, "Username is required");
    }
    const user = yield user_1.User.findOne({ username });
    if (user) {
        throw new ApiError_1.ApiError(400, "Username already taken. Choose something else.");
    }
    const newUser = yield user_1.User.create({ username, password });
    res.status(200).json({
        success: true,
        message: "Account created successfully",
        user: newUser,
    });
})));
router.get("/", (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // check if cookie is present in the request
    const cookie = req.cookies.jwt;
    if (!cookie) {
        throw new ApiError_1.ApiError(401, "Not Authenticated");
    }
    // verify the cookie and get the user Id
    let decodedData;
    try {
        decodedData = (0, jsonwebtoken_1.verify)(cookie, JWT_SECRET);
    }
    catch (err) {
        throw new ApiError_1.ApiError(401, "Token Expired. Please login again");
        return;
    }
    const user = yield user_1.User.findById(decodedData.id).select("-password");
    if (!user) {
        throw new ApiError_1.ApiError(401, "Invalid Request. User does not exist");
    }
    res.status(200).json({ status: true, user });
})));
router.get("/:id", (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.ApiError(400, "Not a valid user");
    }
    res.status(200).json({ success: true, user });
})));
router.get("/:id/followers", (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.ApiError(400, "Not a valid user");
    }
    res.status(200).json({ success: true, followers: user.followers });
})));
