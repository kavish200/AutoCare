const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});

const Service = mongoose.model("services", serviceSchema);
module.exports = Service;