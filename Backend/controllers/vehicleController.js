const Vehicle = require("../models/vehicleModel");

//Create a new vehicle
const createVehicle = async (req, res) => {
    try {
        const {registrationNumber, brand, model, year, fuelType} = req.body;

        const vehicle = await Vehicle.create({
            owner: req.user.id,
            registrationNumber,
            brand,
            model,
            year,
            fuelType
        })

        res.status(201).json({
            message: "Vehicle created successfully!",
            vehicle
        });
    } catch(err) {
        res.status(500).json({
            message: "Error creating vehicle",
            error: err.message
        })
    }
};

//Get all vehicles for a specific owner
const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({
            owner: req.user.id
        })
        if(!vehicles) {
            return res.status(404).json({
                message: "No vehicles found for this owner"
            })
        }
        res.status(200).json({
            message: "Vehicles retrieved successfully",
            vehicles
        });
    } catch(err) {
        res.status(500).json({
            message: "Error in retrieving vehicles",
            error: err.message
        })
    }
};

//Get a specific vehicle by its id
const getVehicleById = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if(vehicle.length === 0) {
            return res.status(404).json({
                message: "Vehicle not found"
            })
        }

        if(vehicle.owner.toString() != req.user.id) {
            return res.status(403).json({
                message: "Access denied. You are not the owner of this vehicle."
            })
        }

        res.status(200).json({
            message: "Vehicle retrieved successfully!",
            vehicle
        });
    } catch(err) {
        res.status(500).json({
            message: "Error in retrieving vehicle",
            error: err.message
        })
    }
}

//Update Vehicle by its id
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if(!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        if(vehicle.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied. You are not the owner of this vehicle."
            })
        }

        const {registrationNumber, brand, model, year, fuelType} = req.body;

        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, {
            registrationNumber,
            brand,
            model,
            year,
            fuelType
        }, {new: true}
    );

    res.status(200).json({
        message: "Vehicle updated successfully!",
        updatedVehicle
    });
    } catch(err) {
        res.status(500).json({
            message: "Error in updating vehicle",
            error: err.message
        })
    }
}

//Delete Vehicle by Id
const deleteVehicle = async (req, res) => {
    try{
        const vehicle = await Vehicle.findById(req.params.id);
        if(!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found!"
            })
        }
        if(vehicle.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied. You are not the owner of this vehicle."
            })
        }

        const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Vehicle deleted succussfully!",
            deletedVehicle
        });
    } catch(err) {
        res.status(500).json({
            message: "Error in deleting vehicle",
            error: err.message
        });
    }
};

module.exports = {createVehicle, getVehicles, getVehicleById, updateVehicle, deleteVehicle};