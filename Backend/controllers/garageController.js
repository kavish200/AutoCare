const Garage = require("../models/garageModel");

const createGarage = async (req, res) => {
    try {
        const {name, phone, address} = req.body;

        const garage = await Garage.create({
            owner: req.user.id,
            name,
            phone,
            address
        });

        res.status(201).json({
            message: "Garage created successfully!",
            garage
        });
    } catch(err) {
        res.status(500).json({
            message: "Error creating garage",
            error: err.message
        })
    }
};

const getGarage = async (req, res) => {
    try {
        const garage = await Garage.findOne({
            owner: req.user.id
        })

        if(!garage) {
            return res.status(404).json({
                message: "Garage not found!"
            })
        }

        if(garage.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied. You are not the owner of this garage." 
            })
        }

        res.status(200).json({
            message: "Garage fetched successfully!",
            garage
        })
    } catch(err) {
        res.status(500).json({
            message: "Error fetching garage",
            error: err.message
        })
    }
};

const getGarageById = async (req, res) => {
    try {
        const garage = await Garage.findById(req.params.id);

        if(!garage) {
            return res.status(404).json({
                message: "Garage not found!"
            })
        }

        if(garage.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied. You are not the owner of this garage."
            })
        }

        res.status(200).json({
            message: "Garage fetched successfully!",
            garage
        })
    } catch(err) {
        res.status(500).json({
            message: "Error fetching garage",
            error: err.message
        })
    }
};

const updateGarage = async (req, res) => {
    try {
        const garage = await Garage.findById(req.params.id);

        if(!garage) {
            return res.status(404).json({
                message: "Garage not found!"
            })
        }

        if(garage.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied. You are not th owner of this garage."
            })
        }

        const {name, phone, address} = req.body;

        const updatedGarage = await Garage.findByIdAndUpdate(req.params.id, {
            name,
            phone, 
            address
        }, {
            new: true
        })

        res.status(200).json({
            message: "Garage updated successfully!",
            updatedGarage
        })
    } catch(err) {
        res.status(500).json({
            message: "Error updating garage",
            error: err.message
        })
    }
};

const deleteGarage = async (req, res) => {
    try {
        const garage = await Garage.findById(req.params.id);

        if(!garage) {
            return res.status(404).json({
                message: "Garage not found!"
            })
        }

        if(garage.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "Access denied. You are not the owner of this garage."
            })
        }

        const deletedGarage = await Garage.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Garage deleted successfully!",
            deletedGarage
        })
    } catch(err) {
        res.status(500).json({
            message: "Error deleting garage",
            error: err.message
        })
    }
};
module.exports = {createGarage, getGarage, getGarageById, updateGarage, deleteGarage};