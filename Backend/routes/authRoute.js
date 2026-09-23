const express = require("express");
const router = express.Router();
const {login, logout, register, getMe, refreshToken, verifyEmail} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register); 
router.get("/getMe", getMe);
router.get("/refreshToken", refreshToken);
router.get("/logout", logout);
router.post("/verifyEmail", verifyEmail);

module.exports = router;