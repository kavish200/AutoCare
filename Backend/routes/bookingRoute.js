const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");
const {createBooking} = require("../controllers/bookingController");

router.post("/createBooking", verifyToken, authorizeRole("customer"), createBooking);

module.exports = router;