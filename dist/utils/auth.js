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
exports.isAuthenticated = exports.generateJWTToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = require("./ApiError");
const user_1 = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // check if cookie is present in the request
    const cookie = req.cookies.jwt;
    if (!cookie) {
        throw new ApiError_1.ApiError(401, "You are not authenticated");
    }
    // verify the cookie and get the user Id
    let decodedData;
    try {
        decodedData = jsonwebtoken_1.default.verify(cookie, JWT_SECRET);
    }
    catch (error) {
        throw new ApiError_1.ApiError(401, "Token Expired. Please login again.");
    }
    const user = yield user_1.User.findById(decodedData.id).select("-password");
    if (user === null) {
        throw new ApiError_1.ApiError(401, "Invalid request. User does not exists.");
    }
    req.user = user;
    next();
});
exports.isAuthenticated = isAuthenticated;
const generateJWTToken = (userId) => {
    try {
        const token = jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET, {
            expiresIn: "60s",
        });
        return token;
    }
    catch (error) {
        throw new Error("Something went wrong while generating the token");
    }
};
exports.generateJWTToken = generateJWTToken;
