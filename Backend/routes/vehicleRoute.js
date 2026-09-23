const express = require("express");
const {createVehicle, getVehicles, getVehicleById} = require("../controllers/vehicleController");
const router = express.Router();
const authorizeRole = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware")

router.post("/createVehicle", verifyToken, authorizeRole("customer"), createVehicle);
router.get("/getVehicles", verifyToken, authorizeRole("customer"), getVehicles);
router.get("/getVehicle/:id", verifyToken, authorizeRole("customer"), getVehicleById);

module.exports = router;