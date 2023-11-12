const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
        username: {
                type: String,
                required: true,
                trim: true
        },
        email: {
                type: String,
                required: true,
                trim: true,
                unique: true
        },
        password: {
                type: String,
                required: true
        },
        photo: {
                type: String,
                default: "https://cdn.pixabay.com/photo/2023/05/02/10/35/avatar-7964945_1280.png"
        }
}, {
        timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;