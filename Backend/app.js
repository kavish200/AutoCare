const express = require("express");
const app = express();
const dotenv = require("dotenv");
const PORT = process.env.PORT

dotenv.config();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Test api")
})

app.listen(PORT, () => {
    console.log("Listening on port 3000");
})