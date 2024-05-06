import mongoose from "mongoose";

const MONGO_URL =
    process.env.MONGO_URL || "mongodb://127.0.0.1:27017/assignment-stuneckt";

const connectDb = async () => {
    await mongoose.connect(MONGO_URL);
};

export { connectDb };
