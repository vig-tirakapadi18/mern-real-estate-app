const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

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
// app.use("/api/google");

app.use((error, req, res, next) => {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal server error!";

        res.status(statusCode).json({
                success: false,
                statusCode,
                message
        })
})

module.exports = app;