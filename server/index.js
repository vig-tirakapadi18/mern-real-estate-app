const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");

dotenv.config();

const app = express();

app.use(express.json());

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

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

module.exports = app;