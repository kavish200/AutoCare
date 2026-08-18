const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
    },
    garage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage",
        required: true,
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Serice",
        required: true,
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["BOOKED", "CONFIRMED", "CANCELLED", "COMPLETED"],
        default: "BOOKED",
    }
})