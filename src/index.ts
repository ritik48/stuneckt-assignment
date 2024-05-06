import express, { NextFunction, Request, Response } from "express";

import { connectDb } from "./db";
import { ApiError } from "./utils/ApiError";
import { router as userRouter } from "./routes/user";
import { router as postRouter } from "./routes/post";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

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
