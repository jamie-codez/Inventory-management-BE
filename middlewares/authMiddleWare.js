const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
    try {
        const token = req.headers["access-token"];
        if (!token) {
            return res.status(403).setHeader("Content-Type", "application/json").json({ code: 403, message: "Access token not provided" });
        }
        const accessToken = token.split(" ")[1];
        const verified = await jwt.verify(accessToken, process.env.JWT_SECRET);
        const id = verified.sub;
        const user = await User.findById({ _id: id }).select("-password");
        if (!user) {
            return res.status(401).setHeader("Content-Type", "application/json").json({ code: 401, message: "User to resource denied, user not known by system" });
        }
        if (!user.verified) {
            return res.status(401).setHeader("Content-Type", "application/json").json({ code: 401, message: "User is not verified in system check email to verify" });
        }
        req.uid = user._id;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).setHeader("Content-Type", "application/json").json({ code: 401, message: "Access denied,please login" });
    }
});


module.exports = { protect };