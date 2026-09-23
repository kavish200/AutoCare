const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token || !token.startsWith("Bearer")) {
        return res.status(401).json({
            message: "Token not found, authorization denied"
        })
    }

    const tokenValue = token.split(" ")[1];

    try {
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

        req.user = decoded;

        console.log("Decoded user:", decoded);
        next();
    }catch(err) {
        return res.status(400).json({
            message: "Token is not valid",
            error: err.message
        })
    }
}

module.exports = verifyToken;