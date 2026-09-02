const express = require("express");
const router = express.Router();
const {register, getMe, refreshToken} = require("../controllers/authController");

router.post("/register", register); 
router.get("/getMe", getMe);
router.get("/refreshToken", refreshToken);

module.exports = {router};