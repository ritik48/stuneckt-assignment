"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const catchError_1 = require("../utils/catchError");
const auth_1 = require("../utils/auth");
const user_1 = require("../controllers/user");
const router = express_1.default.Router();
exports.router = router;
router.get("/", (0, catchError_1.catchError)(auth_1.isAuthenticated), user_1.getCurrentUser);
router.patch("/", (0, catchError_1.catchError)(auth_1.isAuthenticated), user_1.updateUser);
router.post("/login", user_1.userLogin);
router.post("/signup", user_1.userSignup);
router.post("/logout", (0, catchError_1.catchError)(auth_1.isAuthenticated), user_1.userLogout);
router.get("/:id", user_1.getUser);
router.get("/:id/followers", user_1.getFollowers);
