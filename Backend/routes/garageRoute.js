const express = require("express");
const router = express.Router();
const {createGarage, getGarage, getGarageById, updateGarage, deleteGarage} = require("../controllers/garageController");
const verifyToken = require("../middlewares/authMiddleware");
const authorizRole = require("../middlewares/roleMiddleware");

router.post("/create", verifyToken, authorizRole("garageManager"), createGarage);
router.get("/getGarage", verifyToken, authorizRole("garageManager"), getGarage);
router.get("/getGarage/:id", verifyToken, authorizRole("garageManager"), getGarageById);
router.put("/updateGarage/:id", verifyToken, authorizRole("garageManager"), updateGarage);
router.delete("/deleteGarage/:id", verifyToken, authorizRole("garageManager"), deleteGarage);

module.exports = router;