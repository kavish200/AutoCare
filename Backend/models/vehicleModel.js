const mongoose = require("mongoose");

const vehcileSchema = new mongoose.Schema({
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

const Vehcile = mongoose.model("vehicles", vehcileSchema);
module.exports = Vehcile;