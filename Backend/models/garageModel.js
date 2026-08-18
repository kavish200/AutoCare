const mongoose = require("mongoose");

const garageSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    services: {
        type: [String],
        required: true,
    }
})

const Garage = mongoose.model("garages", garageSchema);
module.exports = Garage;