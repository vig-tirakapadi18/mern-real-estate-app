const bcryptjs = require("bcryptjs");

const User = require("../models/user.model");
const errorHandler = require("../utils/error");

exports.signup = async (req, res, next) => {
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password);
        const newUser = new User({ username, email, password: hashedPassword });

        try {
                await newUser.save();

                res.status(201).json({
                        status: "success",
                        message: "User created successfully!"
                })
        } catch (error) {
                next(error);
        }
}