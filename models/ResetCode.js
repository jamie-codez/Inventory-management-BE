const mongoose = require("mongoose");

const codeSchema = mongoose.Schema({
    code: { type: String, required: true },
    owner: { type: String, required: true }
});

const model = mongoose.model("ResetCode", codeSchema);

module.exports = model;