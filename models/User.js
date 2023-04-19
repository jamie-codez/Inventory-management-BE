const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    imageUrl: { type: String, required: true },
    password: { type: String, required: true }
});

const model = mongoose.model("User", userSchema);

module.exports = model