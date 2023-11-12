const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
};

exports.signin = async (req, res, next) => {
        try {
                const { email, password } = req.body;
                const validUser = await User.findOne({ email });

                if (!validUser) return next(errorHandler(404, "User not found!"));

                const validPassword = bcryptjs.compareSync(password, validUser.password);

                if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

                const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
                const { password: pass, ...userInfo } = validUser._doc;
                res.cookie("access_token", token, { httpOnly: true }).status(200).json(userInfo);
        } catch (error) {
                next(error);
        }
};

exports.google = async (req, res, next) => {
        try {
                const user = await User.findOne({ email: req.body.email });

                if (user) {
                        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
                        const { password: pass, ...userInfo } = user._doc;
                        res
                                .cookie("access_token", token, { httpOnly: true })
                                .status(200)
                                .json(userInfo)
                } else {
                        const generatedPassword = Math.random().toString(36).slice(-8) +
                                Math.random().toString(36).slice(-8);
                        const hashedPassword = bcryptjs.hashSync(generatedPassword);
                        const newUser = await User({
                                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-8),
                                email: req.body.email,
                                password: hashedPassword,
                                photo: req.body.photo
                        });

                        await newUser.save();
                        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
                        const { password: pass, ...userInfo } = newUser._doc;
                        res
                                .cookie("access_token", token, { httpOnly: true })
                                .status(200)
                                .json(userInfo);

                }
        } catch (error) {
                next(error);
        }
}