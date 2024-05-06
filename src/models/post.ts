import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model("post", postSchema);

export { Post };
