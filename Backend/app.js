const express = require("express");
const app = express();
const config = require("./config/config");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const cookieParser = require("cookie-parser");
const PORT = config.PORT

connectDB();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Test api")
})

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute)

app.listen(PORT, () => {
    console.log("Listening on port 3000");
})