const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcrypt");
require("colors");

const createUser = asyncHandler(async (req, res) => {
    const { username, firstName, lastName, email, phoneNumber, password } = req.body;
    if (!username || !firstName || !lastName || !email || !phoneNumber || !password) {
        return res.status(400).setHeader("Content-Type", "application/json").json({ code: 400, message: "Kindly provide all fields" })
    }
    if (password.length < 9) {
        return res.status(400).setHeader("Content-Type", "application/json").json({ code: 400, message: "Password too short" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(409).setHeader("Content-Type", "application/json").json({ code: 409, message: "Email already in use." });
    }
    const user = await User.create({ username, firstName, lastName, email, phoneNumber, password });
    if (!user) {
        return res.status(500).setHeader("Content-Type", "application/json").json({ code: 500, message: "Error occurred could not create user" });
    }
    if (user) {
        return res.status(201).setHeader("Content-Type", "application/json").json({ code: 201, message: "User created succcessfully,check email to verify account." });
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const userId = req.body.uid;
    if (!userId) {
        return res.status(400).setHeader("Content-Type", "application/json").json({ code: 400, message: "User id cannot be null" });
    }
    const user = await User.findById({ _id: userId });
    if (!user) {
        return res.status(404).setHeader("Content-Type", "application/json").json({ code: 404, message: "User not found" });
    }
    res.status(200).setHeader("Content-Type", "application").json({ code: 200, message: "Successful", payload: { ...user, password } });
});

const getUsers = asyncHandler(async (req, res) => {
    const { pageNumber, pageSize } = req.body;
    if (!pageNumber) {
        return res.status(200).setHeader("Content-Type", "application/json").json({ code: 400, messaage: "pageNumber cannot be empty" });
    }
    if (!pageSize) {
        return res.status(200).setHeader("Content-Type", "application/json").json({ code: 400, message: "pageSize cannot be empty" });
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
        res.status(200).setHeader("Content-Type", "application/json").json({ code: 200, message: "Successful", payload: users, pagination: { pageNumber: pageNumber, pageSize: pageSize, pages: Number(count) / pageNumber } });
    }).catch(error => {
        console.error(`${error.messaage}`.red);
        res.status(500).setHeader("Content-Type", "application/json").json({ code: 500, message: "Error occurred try again" })
    });
});

const updateUser = asyncHandler(async (req, res) => {
    const { id, payload } = req.body;
    if (!id) {
        return res.status(400).setHeader("Content-Type", "application/json").setHeader("Content-Type", "application/json").json({ code: 400, message: "id cannot be null" });
    }
    if (!payload) {
        return res.status(400).setHeader("Content-Type", "application/json").setHeader("Content-Type", "application/json").json({ code: 400, message: "payload cannot be empty" });
    }
    await User.findByIdAndUpdate({ "_id": id }, { $set: payload })
        .then(result => {
            res.status(200).setHeader("Content-Type", "application/json").json({ code: 200, message: "User updated successfully" })
        })
        .catch(error => {
            res.status(500).setHeader("Content-Type", "application/json").json({ code: 500, messaage: "Error occurred try again" })
            console.error(`${error.message}`.red);
        });
});

const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const user = await User.findOne({ _id: id })
    if (!user) {
        return res.status(404).setHeader("Content-Type", "application/json").json({ code: 404, message: "User not found" });
    }
    await User.findOneAndDelete({ _id: id })
        .then(result => {
            res.status(200).setHeader("Content-Type", "application/json").json({ code: 200, message: "User deleted successfully" });
        })
        .catch(error => {
            res.status(500).setHeader("Content-Type", "application/json").json({ code: 500, messaage: "Error occurred try again" })
            console.error(`${error.messaage}`.red);
        });
});

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };