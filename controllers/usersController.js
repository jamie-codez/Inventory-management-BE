const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
require("colors");

const createUser = asyncHandler(async (req, res) => {
    const { username, firstName, lastName, email, phoneNumber, password } = req.body;
    if (!username || !firstName || !lastName || !email || !phoneNumber || !password) {
        return res.status(400).json({ code: 400, message: "Kindly provide all fields" })
    }
    if (password.length < 9) {
        return res.status(400).json({ code: 400, message: "Password too short" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(409).json({ code: 409, message: "Email already in use." });
    }
    const user = await User.create({ username, firstName, lastName, email, phoneNumber, password });
    if (!user) {
        return res.status(500).json({ code: 500, message: "Error occurred could not create user" });
    }
    if (user) {
        return res.status(201).json({ code: 201, message: "User created succcessfully,check email to verify account." });
    }
});

const getUsers = async (req, res) => {
    const { pageNumber, pageSize } = req.body;
    if (!pageNumber) {
        return res.status(200).json({ code: 400, messaage: "pageNumber cannot be empty" });
    }
    if (!pageSize) {
        return res.status(200).json({ code: 400, message: "pageSize cannot be empty" });
    }
    const skips = (Number(pageNumber) - 1) * (Number(pageSize));
    const count = await User.find().count();
    const projection = {
        password: false,
        createdAt: false,
        updatedAt: false,
        __v: false
    }
    await User.find({}, projection).skip(skips).limit(Number(pageSize)).then(users => {
        res.status(200).json({ code: 200, message: "Successful", payload: users, pagination: { pageNumber: pageNumber, pageSize: pageSize, pages: Number(count) / pageNumber } });
    }).catch(error => {
        console.log(`${error.messaage}`.red);
        res.status(500).json({ code: 500, message: "Error occurred try again" })
    });
}

const updateUser = async (req, res) => {
    const { id, payload } = req.body
    if (!id) {
        return res.status(400).json({ code: 400, message: "id cannot be null" });
    }
    if (!payload) {
        return res.status(400).json({ code: 400, message: "payload cannot be empty" });
    }
    // if (payload.password) {
    //     const salt = await bcrypt.genSalt(10);
    //     const encryptedPassword = await bcrypt.hash(payload.password, salt);
    //     req.body.password = encryptedPassword;
    // }
    await User.findByIdAndUpdate({ "_id": id }, { $set: payload })
        .then(result => {
            res.status(200).json({ code: 200, message: "User updated successfully" })
        })
        .catch(error => {
            res.status(500).json({ code: 500, messaage: "Error occurred try again" })
            console.log(`${error.message}`.red);
        });
}

const deleteUser = async (req, res) => {
    const { id } = req.body;
    const user = await User.findOne({ _id: id })
    if (!user) {
        return res.status(404).json({ code: 404, message: "User not found" });
    }
    await User.findOneAndDelete({ _id: id })
        .then(result => {
            res.status(200).json({ code: 200, message: "User deleted successfully" });
        })
        .catch(error => {
            res.status(500).json({ code: 500, messaage: "Error occurred try again" })
            console.log(`${error.messaage}`.red);
        });
}

module.exports = { createUser, getUsers, updateUser, deleteUser };