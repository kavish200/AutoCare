const mongoose = require("mongoose");

const serviceRecordSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        required: true,
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
    },
    services: {
        type: [String],
        required: true,
    },
    totalCost: {
        type: Number,
        required: true,
    }
}, {
    timestamps: true
});

const ServiceRecord = mongoose.model("serviceRecords", serviceRecordSchema);
modeule.exports = ServiceRecord;