const bcryptjs = require("bcryptjs");

const errorHandler = require("../utils/error");
const User = require("../models/user.model");

exports.testRoute = (req, res) => {
        res.json({
                status: "success",
                message: "Working!"
        })
}

exports.updateUser = async (req, res, next) => {
        if (req.user.id !== req.params.id) return next(errorHandler(403, "You can only update your own account!"));

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