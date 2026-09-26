const Service = require("../models/serviceModel");
const Garage = require("../models/garageModel");

const createService = async (req, res) => {
    try {
        const {name, price} = req.body;

        const garage = await Garage.findOne({
            owner: req.user.id
        });

        if(!garage) {
            return res.status(404).json({
                message: "Garage not found!"
            })
        }

        const service = await Service.create({
            garage: garage._id,
            name,
            price
        })

        res.status(201).json({
            message: "Service created successfully!",
            service
        });
    } catch(err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
};

const getServices = async (req, res) => {
    try {
        const garage = await Garage.findOne({
            owner: req.user.id
        })

        if(!garage) {
            return res.status(404).json({
                message: "Garage not found!"
            })
        }

        const services = await Service.find({
            garage: garage._id,
        })

        if(!services) {
            return res.status(404).json({
                message: "No services found!"
            })
        }

        res.status(200).json({
            message: "Services fetched successfully!",
            services
        })
    } catch(err) {
        res.status(500).json({
            message: "Error fetching services",
            error: err.message
        })
    }
};

const getServicesById = async (req, res) => {
    try {
        const garage = await Garage.findOne({
            owner: req.user.id
        })

        if(!garage) {
            return res.status(404).json({
                message: "Garage not found!"
            })
        }

        const service = await Service.findOne({
            _id: req.params.id,
            garage: garage._id
        });

        if(!service) {
            return res.status(404).json({
                message: "Service not found!"
            })
        }

        res.status(200).json({
            message: "Services fetched successfully!",
            service
        })
    } catch(err) {
        res.status(500).json({
            message: "Error fetching services",
            error: err.message
        })
    }
};

const updateService = async (req, res) => {
    try {
        const {name, price} = req.body;

        const garage = await Garage.findOne({
            owner: req.user.id
        })

        if(!garage) {
            return res.status(404).json({
                message: "Garage not found!"
            })
        }

        const service = await Service.findOneAndUpdate({
            _id: req.params.id,
            garage: garage._id
        }, {
            name,
            price
        }, {new: true});

        if(!service) {
            return res.status(404).json({
                message: "Service not found!"
            })
        }

        res.status(200).json({
            message: "Service updated successfully!",
            service
        })
    } catch(err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
};

const deleteService = async (req, res) => {
    try {
        const garage = await Garage.findOne({
            owner: req.user.id
        })

        if(!garage) {
            return res.status(404).json({
                message: "Garage not found!"
            })
        }

        const service = await Service.findOneAndDelete({
            _id: req.params.id,
            garage: garage._id
        });

        if(!service) {
            return res.status(404).json({
                message: "Service not found!"
            })
        }

        res.status(200).json({
            message: "Service deleted successfully!",
            service
        })
    } catch(err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
};

module.exports = {createService, getServices, getServicesById, updateService, deleteService};