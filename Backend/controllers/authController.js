const User = require("../models/userModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const sessionModel = require("../models/sessionModel");
const sendEmail = require("../services/emailService");
const otpModel = require("../models/optModel");
const {generateOTP, getOtpHtml} = require("../utils/utils");

// Register a new user
const register = async (req, res) => {
    try{
        const {username, email, password, phone, role} = req.body;

        const isAlreadyRegistered = await User.findOne({
            $or: [
                {email},
                {phone}
            ]
        })

        if(isAlreadyRegistered) {
            return res.status(409).json({
            message: "User already exists"
            })
        }

        const hashedPassword = await crypto.createHash("sha256").update(password).digest("hex");

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            phone,
            role: role || "customer"    
        })

        const otp = generateOTP();
        const html = getOtpHtml(otp);

        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        await otpModel.create({
            email, 
            user: user._id,
            otpHash
        })

        await sendEmail(email, "Your OTP code for verification", `Your OTP code is ${otp}`, html);

        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                verified: user.verified
            },
        });
    } catch(err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
}

// Login existing user
const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({
        email
    })

    if(!user) {
        return res.status(404).json({
            message: "Invalid email or password"
        })
    }

    if(!user.verified) {
        return res.status(401).json({
            message: "Email not verified"
        })
    }

    const hashedPassword = await crypto.createHash("sha256").update(password).digest("hex");
    const isPasswordValid = hashedPassword === user.password;

    if(!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const refreshToken = jwt.sign({
        id: user._id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.create({
        user: user._id,
        refreshTokenHash,
        ip: req.ip,
        userAgent: req.headers["user-agent"]
    })

    const accessToken = jwt.sign({
        id: user._id,
        sessionId: session._id
    }, config.JWT_SECRET, {
        expiresIn: "15m"
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.satus(200).json({
        message: "User loged in successfully!",
        user: {
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
        },
        accessToken
    })
}

// Login existing user
// const login = async(req, res) => {
//     const {email, password} = req.body;

//     const user = await User.findOne({
//         email
//     })

//     if(!user) {
//         return res.status(404).json({
//             message: "Invalid email or password"
//         })
//     }

//     const hashedPassword = await crypto.createHash("sha256").update(password).digest("hex");
//     const isPasswordValid = hashedPassword === user.password;

//     if(!isPasswordValid) {
//         return res.status(401).json({
//             message: "Invalid email or password"
//         })
//     }

//     const refreshToken = jwt.sign({
//         id: user._id
//     }, config.JWT_SECRET, {
//         expiresIn: "7d"
//     })

//     const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

//     const session = await sessionModel.create({
//         user: user._id,
//         refreshTokenHash,
//         ip: req.ip,
//         userAgent: req.headers["user-agent"]
//     })

//     const accessToken = jwt.sign({
//         id: user._id,
//         sessionId: session._id
//     }, config.JWT_SECRET, {
//         expiresIn: "15m"
//     })

//     res.cookie("resfreshToken", refreshToken, {
//         httpOnly: true,
//         secure: true,
//         sameSite: "strict",
//         maxAge: 7 * 24 * 60 * 60 * 1000
//     })


//     res.status(200).json({
//         message: "User logged in successfully!",
//         user: {
//             username: user.username,
//             email: user.email,
//             phone: user.phone
//         },
//         accessToken,
//     })
// }

// Get the details of the user
const getMe = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];

    if(!token) {
        return res.status(401).json({
            message: "Token not found"
        })
    }

    const decode = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decode.id);

    res.status(200).json({
        message: "User details fetched successfully!",
        user: {
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    })
}

// Refresh the access token using refresh token
const refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }

    const decode = jwt.verify(refreshToken, config.JWT_SECRET);

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if(!session) {
        return res.status(401).json({
            message: "Invalid refresh token"
        })
    }

    const accessToken = jwt.sign({
        id: decode.id
    }, config.JWT_SECRET, {
        expiresIn: "15m"
    })

    res.status(200).json({
        message: "Access token refreshed successfully!",
        accessToken
    })

    const newRefreshToken = jwt.sign({
        id: decode.id
    }, config.JWT_SECRET, {
        expiresIn: "7d"
    })

    const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");

    session.refreshTokenHash = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

const logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        return res.status(401).json({
            message: "Refresh token not found"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if(!session) {
        return res.status(401).json({
            message: "Invalid refresh token"
        })
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");
    res.status(200).json({
        message: "User logged out successfully!"
    })
}

const verifyEmail = async (req, res) => {
    const {email, otp} = req.body;
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    const otpDoc = await otpModel.findOne({
        email,
        otpHash
    })

    if(!otpDoc) {
        return res.status(400).json({
            message: "Invalid OTP"
        })
    }

    const user = await User.findByIdAndUpdate(otpDoc.user, {
        verified: true
    })

    await otpModel.deleteMany({
        user: otpDoc.user
    })

    return res.status(200).json({
        message: "Email verified successfully!",
        user: {
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            verified: user.verified
        }  
    })
}
module.exports = {login, logout, register, getMe, refreshToken, verifyEmail};