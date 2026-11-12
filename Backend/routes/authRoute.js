const express = require("express");
const router = express.Router();
const {login, logout, register, getMe, updateProfile, refreshToken, verifyEmail} = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");

router.post("/login", login);
router.post("/register", register); 
router.get("/getMe", verifyToken, getMe);
router.put("/updateProfile", verifyToken, updateProfile);
router.get("/refreshToken", refreshToken);
router.get("/logout", logout);
router.post("/verifyEmail", verifyEmail);

module.exports = router;