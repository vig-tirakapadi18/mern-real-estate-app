const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");

const userRouter = require("./routes/user.route");
const authRouter = require("./routes/auth.route");
const listingRouter = require("./routes/listing.route");

dotenv.config();

mongoose.connect(process.env.CONN_STR)
        .then(() => {
                console.log("Connected to MongoDB!");
        })
        .catch((err) => {
                console.log(err.message);
        })

// const __dirname = path.resolve();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.listen(process.env.PORT, () => {
        console.log("Server started!")
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
})

app.use((error, req, res, next) => {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal server error!";

        return res.status(statusCode).json({
                success: false,
                statusCode,
                message
        })
})

module.exports = app;