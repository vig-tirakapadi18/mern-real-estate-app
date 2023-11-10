const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

mongoose.connect(process.env.CONN_STR)
        .then(() => {
                console.log("Connected to MongoDB!");
        })
        .catch((err) => {
                console.log(err.message);
        })

app.listen(process.env.PORT, () => {
        console.log("Server started!")
});