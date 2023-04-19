const router = require('express').Router();
const { createUser, getUsers, updateUser, deleteUser } = require("../controllers/usersController");

router.post("/", createUser);

router.get("/", getUsers);

router.put("/", updateUser);

router.delete("/", deleteUser);

module.exports = router;