const mongoose = require("mongoose");

const activationSchema = mongoose.Schema({
    code: { type: String, required: true },
    owner: { type: String, required: true }
});

const activationCode = mongoose.model("Activation", activationSchema);

module.exports = { activationCode };