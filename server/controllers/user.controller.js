const bcryptjs = require("bcryptjs");

const errorHandler = require("../utils/error");
const User = require("../models/user.model");
const Listing = require("../models/listing.model");

exports.testRoute = (req, res) => {
        res.json({
                status: "success",
                message: "Working!"
        })
}

exports.updateUser = async (req, res, next) => {
        if (req.user.id !== req.params.id) return next(errorHandler(401, "You are unauthorized to update this account!"));

        try {
                if (req.body.password) {
                        req.body.password = bcryptjs.hashSync(req.body.password);
                }

                const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                        $set: {
                                username: req.body.username,
                                email: req.body.email,
                                password: req.body.password,
                                photo: req.body.photo
                        }
                }, { new: true })

                const { password, ...userInfo } = updatedUser._doc;
                res.status(200).json(userInfo);
        } catch (error) {
                next(error);
        }
}

exports.deleteUser = async (req, res, next) => {
        if (req.body.id !== req.params.id) return next(errorHandler(401, "You are not authorized to delete this account!"));

        try {
                await User.findByIdAndDelete(req.params.id);
                res.clearCookie("access_token");
                res.status(200).json({ message: "User deleted successfully!" });
        } catch (error) {
                next(error);
        }
}

exports.getUserListing = async (req, res, next) => {
        if (req.user.id === req.params.id) {
                try {
                        const listings = await Listing.find({ userRef: req.params.id });
                        res.status(200).json(listings);
                } catch (error) {
                        next(error);
                }
        } else {
                return next(errorHandler(401, "You are not authorized to access this account!"))
        }
}