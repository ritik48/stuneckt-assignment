"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db");
const user_1 = require("./routes/user");
const post_1 = require("./routes/post");
const PORT = process.env.PORT || 3000;
const COOKIE_SECRET = process.env.COOKIE_SECRET || "cookiesecret";
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND || "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(COOKIE_SECRET));
app.get("/", (req, res) => {
    res.json({ success: true, message: "Server online" });
});
app.use("/user", user_1.router);
app.use("/post", post_1.router);
app.use((err, req, res, next) => {
    const { message, status = 500 } = err;
    res.status(status).json({ success: false, message });
});
(0, db_1.connectDb)()
    .then(() => {
    console.log("Connect to databse.");
    app.listen(PORT, () => {
        console.log("Listening on port ", PORT);
    });
})
    .catch(() => console.log("Error connecting to database"));
