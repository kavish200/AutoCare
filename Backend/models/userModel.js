    const mongoose = require("mongoose");

    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            enum: ["customer", "garageManager", "admin"],
            default: "customer",
        },
    }, {
        timestamps: true,
    });

const User = mongoose.model("users", userSchema);
module.exports = User;