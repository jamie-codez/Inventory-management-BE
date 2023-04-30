const router = require("express").Router();
const { login, resetPassword, requestResetPassword, sendPasswordResetpage, refreshJwt } = require("../controllers/authController");

router.post("/login", login);
router.post("/resetPassword", resetPassword);
router.post("/requestResetPassword", requestResetPassword);
router.get("/sendPasswordResetpage/:code", sendPasswordResetpage);
router.post("/refreshJwt", refreshJwt);

module.exports = router;