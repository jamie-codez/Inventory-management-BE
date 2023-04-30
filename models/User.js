const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: { type: String, required: [true, "Please add a username"] },
    firstName: { type: String, required: [true, "Please add a first name"] },
    lastName: { type: String, required: [true, "Please add a last name"] },
    email: { type: String, required: [true, "Please add an email"], unique: true, trim: true, match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Enter a valid email"] },
    phoneNumber: { type: String, required: [true, "Please add a phone number"] },
    bio: { type: String, required: [true, "Please add a bio"], maxLength: [250, "Bio cannot be more than 250 characters"], default: "Bio" },
    imageUrl: { type: String, required: [true, "Please add an image url"], default: "default" },
    password: { type: String, required: [true, "Please add a password"], minLength: [8, "Password must be more than 7 characters"], maxLength: [250, "Password cannot be more than 50 characters"] }
}, { timestamps: true });

const model = mongoose.model("User", userSchema);

module.exports = model