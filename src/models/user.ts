import mongoose, { Document, MongooseError } from "mongoose";
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
    console.log("yes");

   // If the password is not modified then return to avoid unnecessary hashing
    if (!this.isModified(this.password)) return;

    const passwordHash = await bcrypt.hash(this.password, 10);
    this.password = passwordHash;

    next();
});

// hash the password before updating the user
userSchema.pre("findOneAndUpdate", async function (next) {

    // Extract the updated document from this.getUpdate()
    const update: any = this.getUpdate();

    // If the password is not modified then return to avoid unnecessary hashing
    if (!update?.password) return next();

    const passwordHash = await bcrypt.hash(update.password, 10);
    update.password = passwordHash;

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
