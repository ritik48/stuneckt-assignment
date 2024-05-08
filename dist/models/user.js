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
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    followers: {
        type: [Schema.Types.ObjectId],
        ref: "user",
    },
});
// hash the password before saving the user
userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // If the password is not modified then return to avoid unnecessary hashing
        if (!this.isModified("password"))
            return;
        const passwordHash = yield bcrypt_1.default.hash(this.password, 10);
        this.password = passwordHash;
        next();
    });
});
// hash the password before updating the user
userSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Extract the updated document from this.getUpdate()
        const update = this.getUpdate();
        // If the password is not modified then return to avoid unnecessary hashing
        if (!(update === null || update === void 0 ? void 0 : update.password))
            return next();
        const passwordHash = yield bcrypt_1.default.hash(update.password, 10);
        update.password = passwordHash;
        next();
    });
});
// Static method to compare password on login
userSchema.methods.isValidPassword = function isValidPassword(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const match = yield bcrypt_1.default.compare(password, this.password);
        return match;
    });
};
const User = mongoose_1.default.model("user", userSchema);
exports.User = User;
