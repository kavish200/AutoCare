const mongoose = require("mongoose");

const Vehicle = require("../models/vehicleModel");
const Service = require("../models/serviceModel");
const Garage = require("../models/garageModel");
const Booking = require("../models/bookingModel");

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

const getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if(!booking) {
            return res.status(404).json({
                message: "Booking not found!"
            })
        }

        if(booking.customer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to view this booking."
            })
        }
        
        res.status(200).json({
            message: "Booking fetched successfully!",
            booking
        })
    } catch(err) {
        res.status(500).json({
            message: "Error fetching booking",
            error: err.message
        })
    }
}

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            customer: req.user.id
        })
        .populate("vehicle", "brand model registrationNumber")
        .populate("garage", "name address phone")
        .populate("service", "name price")
        .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Bookings fetched successfully!",
            bookings
        });

    } catch(err) {
        res.status(500).json({
            message: "Error fetching bookings",
            error: err.message
        });
    }
};


const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found!"
            });
        }

        // Check whether this booking belongs to the logged-in customer
        if (booking.customer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not authorized to cancel this booking!"
            });
        }

        // Only active bookings can be cancelled
        if (!["BOOKED", "CONFIRMED"].includes(booking.status)) {
            return res.status(400).json({
                message: "This booking cannot be cancelled!"
            });
        }

        booking.status = "CANCELLED";
        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully!",
            booking
        });

    } catch (err) {
        res.status(500).json({
            message: "Error cancelling booking",
            error: err.message
        });
    }
};

module.exports = {createBooking, getBooking, getMyBookings, cancelBooking};