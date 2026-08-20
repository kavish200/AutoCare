const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "booking",
        required: true,
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    garage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage",
        required: true,
    },
    items: {
        type: [String],
        required: true
    },
    subtotal: {
        type: Number,
        required: true,
    },
    total: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID"],
        default: "PENDING",
    }
}, {
    timestamps: true
})