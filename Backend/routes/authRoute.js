const express = require("express");
const router = express.Router();
const {login, register, getMe, refreshToken} = require("../controllers/authController");

// router.post("/login", login);
router.post("/register", register); 
router.get("/getMe", getMe);
router.get("/refreshToken", refreshToken);

module.exports = {router};