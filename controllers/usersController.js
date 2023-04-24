const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const createUser = asyncHandler(async (req, res) => {
    const { username, firstName, lastName, email, phoneNumber, password } = req.body;
    if (!username || !firstName || !lastName || !email || phoneNumber || !password) {
        return res.status(400).json({ code: 400, message: "Kindly provide all fields" })
    }
    if (password.length < 8) {
        return res.status(400).json({ code: 400, message: "Password too short" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(409).json({ code: 409, message: "Email already in use." });
    }
    const salt = bcrypt.genSalt(10)
    const encryptedPassword = bcrypt.hash(password, salt);
    const user = await User({ username, firstName, lastName, email, phoneNumber, encryptedPassword });
    if(!user){
        return res.status(500).json({code:500,message:"Error occurred could not create user"});
    }
    if(user){
        return res.status(201).json({code:201,message:"User created succcessfully"});
    }
});

const getUsers = async (req, res) => {
    res.send("Hello getUsers");
}

const updateUser = async (req, res) => {
    res.send("Hello updateUser");
}

const deleteUser = async (req, res) => {
    res.send("Hello deleteUser");
}

module.exports = { createUser, getUsers, updateUser, deleteUser };