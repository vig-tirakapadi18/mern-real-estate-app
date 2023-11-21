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

exports.updateListing = async (req, res, next) => {
        const listing = await Listing.findById(req.params.id);

        if (!listing) return next(errorHandler(404, "Listing does not exist!"));

        if (req.user.id !== listing.userRef)
                return next(errorHandler(401, "Y0u are not authorized to update this listing!"));

        try {
                const updatedListing = await Listing.findByIdAndUpdate(
                        req.params.id,
                        req.body,
                        { new: true }
                );
                res.status(200).json(updatedListing);
        } catch (error) {
                next(error);
        }
}

exports.getListing = async (req, res, next) => {
        try {
                const listing = await Listing.findById(req.params.id);
                if (!listing) return next(errorHandler(404, "Listing not found!"));

                res.status(200).json(listing);
        } catch (error) {
                next(error);
        }
};

exports.getListings = async (req, res, next) => {
        const limit = req.query.limit || 9;
        const startIndex = req.query.startIndex || 0;
        const searchTerm = req.query.searchTerm || "";
        const sort = req.query.sort || "createdAt";
        const order = req.query.order || "desc";
        let offer = req.query.offer;
        let furnished = req.query.furnished;
        let parking = req.query.parking;
        let type = req.query.type;

        if (offer === undefined || offer === "false") offer = { $in: [true, false] };
        if (furnished === undefined || offer === "false") furnished = { $in: [true, false] };
        if (parking === undefined || parking === "false") parking = { $in: [true, false] };
        if (type === undefined || type === "all") type = { $in: [true, false] };

        try {
                const listings = await Listing.find({
                        name: { $regex: searchTerm, $options: "i" },
                        offer,
                        furnished,
                        parking,
                        type
                })
                        .sort({ [sort]: order })
                        .limit(limit)
                        .skip(startIndex);

                return res.status(200).json(listings);
        } catch (error) {
                next(error);
        }

};