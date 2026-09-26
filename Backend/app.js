const express = require("express");
const app = express();
const config = require("./config/config");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const vehicleRoute = require("./routes/vehicleRoute");
const serviceRoute = require("./routes/serviceRoute");
const garageRoute = require("./routes/garageRoute");
const bookingRoute = require("./routes/bookingRoute");
const cookieParser = require("cookie-parser");
const PORT = config.PORT

connectDB();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Test api")
})

app.use("/api/auth", authRoute);
app.use("/api/vehicle", vehicleRoute);
app.use("/api/service", serviceRoute);
app.use("/api/garage", garageRoute);
app.use("/api/booking", bookingRoute);

app.listen(PORT, () => {
    console.log("Listening on port 3000");
})