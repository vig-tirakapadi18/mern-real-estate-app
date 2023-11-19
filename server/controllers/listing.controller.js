const Listing = require("../models/listing.model");
const errorHandler = require("../utils/error");

exports.createListing = async (req, res, next) => {
        try {
                const listing = await Listing.create(req.body);
                return res.status(201).json(listing);
        } catch (error) {
                next(error);
        }
};

exports.deleteListing = async (req, res, next) => {
        const listing = await Listing.findById(req.params.id);
        console.log(listing);
        console.log(req.params);
        // console.log(listing.userRef)

        if (!listing) {
                return next(errorHandler(404, "Listing does not exist!"))
        }

        if (req.user.id !== listing.userRef) {
                return next(errorHandler(401, "You are not authorized to delete this listing!"));
        }

        try {
                await Listing.findByIdAndDelete(req.params.id);
                res.status(200).json("Listing deleted successfully!");
        } catch (error) {
                next(error);
        }
}