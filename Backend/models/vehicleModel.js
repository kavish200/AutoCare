const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true, 
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    brand: {
        type: String,
        required: true,
    },
    model: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
    },
    fuelType: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
});

const Vehicle = mongoose.model("vehicles", vehicleSchema);
module.exports = Vehicle;