const express = require("express");
const app = express();
const config = require("./config/config");
const connectDB = require("./config/db");
const {router} = require("./routes/authRoute");
const cookieParser = require("cookie-parser");
const PORT = config.PORT

connectDB();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Test api")
})

app.use("/api/auth", router);

app.listen(PORT, () => {
    console.log("Listening on port 3000");
})