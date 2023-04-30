const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ResetCode = require("../models/ResetCode");
const { randomAlphaNumeric } = require("../utils/utils");
require("colors");

const login = async (req, res) => {
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
    const authToken = await jwt.sign({ sub: user.email, expiresIn: "7d" }, process.env.JWT_SECRET, { algorithm: "RS256" })
    const refreshToken = await jwt.sign({ sub: user.email, expiresIn: "7d" }, process.env.JWT_SECRET, { algorithm: "RS256" })
    res.status(200).setHeader("access-token", authToken).setHeader("refresh-token", refreshJwt).json({ code: 200, message: "Login successful" });
};

const resetPassword = async (req, res) => {
    const { password } = req.body;
    const code = req.params["code"];
    if (!password) {
        return res.status(403).setHeader("Content-Type", "application/json").json({ code: 403, message: "passwordcannot be null" });
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
    await User.findOneAndUpdate({ _id:owner }, { $set: { password: password } })
        .then(response => {
            res.status(200).setHeader("Content-Type", "application/json").json({ code: 200, message: "Password update successfully" });
        }).catch(error => {
            console.log(`${error.message}`.red);
            res.status(500).setHeader("Content-Type", "application/json").json({ code: 500, message: "Error occurred try again" });
        });
};

const requestResetPassword = async (req, res) => {
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
};

const sendPasswordResetpage = async (req, res) => {
    res.status(200).sendFile(path.join(__dirname, "../static/password", "password.html"));
};

const refreshJwt = async (req, res) => {
    res.send("refresh jwt");
};

module.exports = { login, resetPassword, requestResetPassword, sendPasswordResetpage, refreshJwt };