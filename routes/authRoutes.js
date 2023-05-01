const router = require("express").Router();
const { login, logout,resetPassword, requestResetPassword, sendPasswordResetpage, refreshJwt } = require("../controllers/authController");

router.post("/login", login);
router.get("/logout",logout);
router.post("/resetPassword/:code", resetPassword);
router.post("/requestResetPassword", requestResetPassword);
router.get("/sendPasswordResetpage/:code", sendPasswordResetpage);
router.post("/refreshJwt", refreshJwt);

module.exports = router;