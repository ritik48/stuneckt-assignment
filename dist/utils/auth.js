"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWTToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";
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
