import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    const token = jwt.sign({ userId }, 'sdjdsjdsjjddsjsdjdsjsdjsdj', { expiresIn: "1d" });

    // Set JWT as an http-only cookie
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: "development" !== "development",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    return token;
};

export default generateToken;
