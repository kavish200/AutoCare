const Booking = require("../models/bookingModel");
const Vehicle = require("../models/vehicleModel");
const Service = require("../models/serviceModel");
const Garage = require("../models/garageModel");

const createBooking = async (req, res) => {
    try {
        const {vehicle, service, garage, appointmentDate} = req.body;
        const customer = req.user.id;
        const vehicleData = await Vehicle.findById(vehicle);

        if(!vehicleData) {
            return res.status(404).json({
                message: "Vehicle not found!"
            })
        }

        console.log("Logged in customer:", customer);
console.log("Vehicle owner:", vehicleData.owner.toString());

        if(vehicleData.owner.toString() !== customer) {
            return res.status(403).json({
                message: "You are not authorized to book this vehicle."
            })
        }

        const garageData = await Garage.findById(garage);

        if(!garageData) {
            return res.status(404).json({
                message: "Garage not found!"
            })
        }
        const serviceData = await Service.findById(service);

        if(!serviceData) {
            return res.status(404).json({
                message: "Service not found!"
            })
        }

        if(serviceData.garage.toString() !== garageData._id.toString()) {
            return res.status(403).json({
                message: "This service does not belong to the specified garage."
            })
        }

        const booking = await Booking.create({
            customer,
            vehicle,
            service,
            garage,
            appointmentDate
        })

        res.status(201).json({
            message: "Booking created successfully.",
            booking
        })
    } catch(err) {
        res.status(500).json({
            message: "Error creating booking",
            error: err.message
        })
    }
};

module.exports = {createBooking};