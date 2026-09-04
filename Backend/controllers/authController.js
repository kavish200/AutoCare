const User = require("../models/userModel");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const sessionModel = require("../models/sessionModel");

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

        const refreshToken = jwt.sign({
            id: user._id,
        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })

        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.create({
            userId: user._id,
            refreshTokenHash,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        })

        const accessToken = jwt.sign({
            id: user._id,
        }, config.JWT_SECRET, {
            expiresIn: "15m"
        })

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(201).json({
            message: "User registered successfully!",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role
            },
            accessToken,

        });
    } catch(err) {
        res.status(500).json({
            message: "Internal server error",
            error: err.message
        })
    }
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

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}
module.exports = {register, getMe, refreshToken};