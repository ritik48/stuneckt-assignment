import dotenv from "dotenv";

dotenv.config();
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDb } from "./db";
import { ApiError } from "./utils/ApiError";
import { router as userRouter } from "./routes/user";
import { router as postRouter } from "./routes/post";

const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET || "cookiesecret";

const app = express();
app.use(
    cors({
        origin: process.env.FRONTEND || "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

app.get("/", (req: Request, res: Response) => {
    res.json({ success: true, message: "Server online" });
});

app.use("/user", userRouter);
app.use("/post", postRouter);

app.use(
    (err: ApiError, req: Request, res: Response, next: NextFunction): void => {
        const { message, status = 500 } = err;

        res.status(status).json({ success: false, message });
    }
);

connectDb()
    .then(() => {
        console.log("Connect to databse.");
        app.listen(PORT, () => {
            console.log("Listening on port ", PORT);
        });
    })
    .catch(() => console.log("Error connecting to database"));
