const router = require("express").Router();
const { login, logut,resetPassword, requestResetPassword, sendPasswordResetpage, refreshJwt } = require("../controllers/authController");

router.post("/login", login);
router.post("/logout",logut);
router.post("/resetPassword/:code", resetPassword);
router.post("/requestResetPassword", requestResetPassword);
router.get("/sendPasswordResetpage/:code", sendPasswordResetpage);
router.post("/refreshJwt", refreshJwt);

module.exports = router;