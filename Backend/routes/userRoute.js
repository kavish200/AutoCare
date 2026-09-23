const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Only Admin can access this route
router.get("/admin", verifyToken, roleMiddleware("admin"), (req, res) => {
    res.json({message: "Welcome Admin!"})
})
// Both Admin and Garage Manager can access this route
router.get("/garageManager", verifyToken, roleMiddleware("admin", "garageManager"), (req, res) => {
    res.json({message: "Welcome Garage Manager!"})
})
// All can access this route
router.get("/customer", verifyToken, roleMiddleware("admin", "garageManager", "customer"), (req, res) => {
    res.json({message: "Welcome Customer!"})
})

module.exports = router;