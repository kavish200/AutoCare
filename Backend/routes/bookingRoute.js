const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");
const {createBooking, getBooking, getMyBookings, cancelBooking} = require("../controllers/bookingController");

router.post("/createBooking", verifyToken, authorizeRole("customer"), createBooking);
router.get("/getBooking/:id", verifyToken, authorizeRole("customer", "garageManager"), getBooking);
router.get("/myBookings", verifyToken, authorizeRole("customer"), getMyBookings);
router.put("/cancelBooking/:id", verifyToken, authorizeRole("customer"), cancelBooking);

module.exports = router;