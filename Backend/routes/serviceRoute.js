const express = require("express");
const router = express.Router();
const {createService, getServices, getServicesById, updateService, deleteService} = require("../controllers/serviceController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRole = require("../middlewares/roleMiddleware");

router.post("/createServices", verifyToken, authorizeRole("garageManager") , createService);
router.get("/getServices", verifyToken, authorizeRole("garageManager"), getServices);
router.get("/getServicesById/:id", verifyToken, authorizeRole("garageManager"), getServicesById);
router.put("/updateService/:id", verifyToken, authorizeRole("garageManager"), updateService);
router.delete("/deleteService/:id", verifyToken, authorizeRole("garageManager"), deleteService);

module.exports = router;