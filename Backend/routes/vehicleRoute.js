const express = require("express");
const {createVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle} = require("../controllers/vehicleController");
const router = express.Router();
const authorizeRole = require("../middlewares/roleMiddleware");
const verifyToken = require("../middlewares/authMiddleware")

router.post("/createVehicle", verifyToken, authorizeRole("customer"), createVehicle);
router.get("/getVehicles", verifyToken, authorizeRole("customer"), getVehicles);
router.get("/getVehicle/:id", verifyToken, authorizeRole("customer"), getVehicleById);
router.put("/updateVehicle/:id", verifyToken, authorizeRole("customer"), updateVehicle);
router.delete("/deleteVehicle/:id", verifyToken, authorizeRole("customer"), deleteVehicle);

module.exports = router;