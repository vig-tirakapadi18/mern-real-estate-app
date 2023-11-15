const Listing = require("../models/listing.model");

exports.createListing = async (req, res, next) => {
        try {
                const listing = await Listing.create(req.body);
                res.status(201).json(listing);
        } catch (error) {
                next(error);
        }
};