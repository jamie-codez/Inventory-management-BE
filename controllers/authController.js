const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const ResetCode = require("../models/ResetCode");
const { randomAlphaNumeric } = require("../utils/utils");
require("colors");

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).setHeader("Content-Type", "application/json").json({ code: 400, message: "Please provide all fields" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).setHeader("Content-Type", "application/json").json({ code: 404, message: "User does not exist" });
    }
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
        return res.status(403).setHeader("Content-Type", "application/json").json({ code: 403, message: "Invalid credentials" });
    }
    const authToken = await jwt.sign({ sub: user._id, expiresIn: "7d", iat: Date.now() }, process.env.JWT_SECRET)
    const refreshToken = await jwt.sign({ sub: user._id, expiresIn: "30d", iat: Date.now() }, process.env.JWT_SECRET)
    res.setHeader("Content-Type", "application/json");
    res.cookie("access-token", `Bearer ${authToken}`, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + (1000 * 3600 * 24 * 7)),
        sameSite: "none",
        secure: true
    });
    res.cookie("refresh-token", `Bearer ${refreshToken}`, {
        path: "/",
        httpOnly: true,
        expires: new Date(Date.now() + (1000 * 3600 * 24 * 30)),
        sameSite: "none",
        secure: true
    });
    res.status(200).json({ code: 200, message: "Login successful" });
});

const logout = asyncHandler(async (req, res) => {
    res.cookie("access-token", "", {
        path: "/",
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });
    res.status(200).setHeader("Content-Type", "application/json").json({ code: 200, message: "Logout successful" });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const code = req.params["code"];
    if (!password) {
        return res.status(403).setHeader("Content-Type", "application/json").json({ code: 403, message: "password cannot be null" });
    }
    const resetCode = await ResetCode.findOne({ code });
    if (!resetCode) {
        //TODO: Send email to user regarding the attempt.
        return res.status(403).setHeader("Content-Type", "application/json").json({ code: 404, message: "Reset code already used" });
    }
    const owner = resetCode.owner
    const user = await User.findOne({ owner })
    if (!user) {
        return res.status(404).setHeader("Content-Type", "application/json").json({ code: 404, message: "User does not exist" });
    }
    await User.findOneAndUpdate({ _id: owner }, { $set: { password: password } })
        .then(response => {
            res.status(200).setHeader("Content-Type", "application/json").json({ code: 200, message: "Password update successfully" });
        }).catch(error => {
            console.log(`${error.message}`.red);
            res.status(500).setHeader("Content-Type", "application/json").json({ code: 500, message: "Error occurred try again" });
        });
});

const requestResetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).setHeader("Content-Type", "application/json").json({ code: 400, message: "email cannot be empty" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).setHeader("Content-Type", "application/json").json({ code: 404, message: "User not found" });
    }
    const code = randomAlphaNumeric();
    const owner = user._id;
    const resetCode = ResetCode.create({ code: code, owner: owner });
    if (!resetCode) {
        return res.status(500).setHeader("Content-Type", "application/json").json({ code: 500, message: "Error processing password reset request" });
    }
    //TODO: send email to user with reset link -> containing the code
    res.status(200).setHeader("Content-Type", "application/json").json({ code: 200, message: "Password reset link has been sent to your email" });
});

const sendPasswordResetpage = asyncHandler(async (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../static/password", "password.html"));
});

const refreshJwt = asyncHandler(async (req, res) => {
    const refreshToken = req.headers["refresh-token"];
    const decodedJwt = await jwt.verify(refreshJwt, process.env.JWT_SECRET)
    if (decodedJwt.expiresIn <= Date.now()) {
        const authToken = await jwt.sign({ sub: user._id, expiresIn: "7d", iat: Date.now() }, process.env.JWT_SECRET)
        res.setHeader("Content-Type", "application/json");
        res.cookie("access-token", authToken, {
            path: "/",
            httpOnly: true,
            expires: new Date(Date.now() + (1000 * 3600 * 24 * 7)),
            sameSite: "none",
            secure: true
        });
        return res.status(200).json({ code: 200, message: "Token refreshed succesddfully." })
    }
    res.status(403).setHeader("Content-Type", "application/json").json({ code: 403, message: "Refresh token expired you need to login again" });
});

module.exports = { login, logout, resetPassword, requestResetPassword, sendPasswordResetpage, refreshJwt };