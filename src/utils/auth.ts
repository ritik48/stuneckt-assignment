import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "jwtsecret";

const generateJWTToken = (userId: string) => {
    try {
        const token = jwt.sign({ id: userId }, JWT_SECRET, {
            expiresIn: "60s",
        });

        return token;
    } catch (error) {
        throw new Error("Something went wrong while generating the token");
    }
};

export { generateJWTToken };
