const express = require("express");
const app = express();
const config = require("./config/config");
const connectDB = require("./config/db");
const PORT = config.PORT

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Test api")
})

app.listen(PORT, () => {
    console.log("Listening on port 3000");
})