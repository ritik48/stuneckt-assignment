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
router.get("/", (0, catchError_1.catchError)(auth_1.isAuthenticated), (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({ status: true, user: req.user });
})));
router.get("/:id", (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.ApiError(400, "Not a valid user");
    }
    res.status(200).json({ success: true, user });
})));
router.patch("/", (0, catchError_1.catchError)(auth_1.isAuthenticated), (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = req.body;
    // check if the data is not undefined
    if (!data) {
        throw new ApiError_1.ApiError(401, "Please provide the data to update");
    }
    // check if the field user want to update is not empty
    for (let d in data) {
        if (!data[d]) {
            throw new ApiError_1.ApiError(401, `${d} cannot be empty`);
        }
    }
    // create a new object with the required updates
    let update = {};
    for (let d in data) {
        update[d] = data[d];
    }
    const x = yield user_1.User.findOneAndUpdate({ _id: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }, update);
    res.status(201).json({ success: true, message: "User updated" });
})));
router.get("/:id/followers", (0, catchError_1.catchError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield user_1.User.findById(id);
    if (!user) {
        throw new ApiError_1.ApiError(400, "Not a valid user");
    }
    res.status(200).json({ success: true, followers: user.followers });
})));
