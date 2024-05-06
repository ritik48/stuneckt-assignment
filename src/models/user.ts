import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types";

const Schema = mongoose.Schema;

// UserDocument created so that methods we define on the schema are available on the documents
interface UserDocument extends IUser, Document {
    followers: [string];
    isValidPassword(password: string): () => Promise<boolean>;
}

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
userSchema.pre("save", async function (next) {
    const passwordHash = await bcrypt.hash(this.password, 10);
    this.password = passwordHash;

    next();
});

// Static method to compare password on login
userSchema.methods.isValidPassword = async function isValidPassword(
    this: UserDocument,
    password: string
) {
    const match = await bcrypt.compare(password, this.password);
    return match;
};

const User = mongoose.model<UserDocument>("user", userSchema);

export { User };
