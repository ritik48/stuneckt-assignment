import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    followers: {
        type: [Schema.Types.ObjectId],
        ref: "user",
    },
});

const User = mongoose.model("user", userSchema);

export { User };
