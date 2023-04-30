const router = require('express').Router();
const { createUser, getUsers, updateUser, deleteUser } = require("../controllers/usersController");

router.post("/register", createUser);

router.get("/getUsers", getUsers);

router.put("/updateUser", updateUser);

router.delete("/deleteUser", deleteUser);

module.exports = router;