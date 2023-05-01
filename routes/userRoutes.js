const router = require('express').Router();
const { createUser, getUsers, activateAccount,updateUser, deleteUser, getUserById } = require("../controllers/usersController");
const { protect } = require('../middlewares/authMiddleWare');

router.post("/register", protect, createUser);

router.get("/getUsers", protect, getUsers);

router.get("/activate/:code",activateAccount);

router.get("/getUserById", protect, getUserById);

router.put("/updateUser", protect, updateUser);

router.delete("/deleteUser", protect, deleteUser);

module.exports = router;