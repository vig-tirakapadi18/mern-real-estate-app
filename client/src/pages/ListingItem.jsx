import { Link } from "react-router-dom";
import { FaBath, FaMapLocationDot } from "react-icons/fa6";
import { FaBed } from "react-icons/fa";

/* eslint-disable react/prop-types */
const ListingItem = (props) => {
    return (
        <div className=" flex justify-center">
            <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px] m-4">
                <Link
                    to={`/listing/${props.listing._id}`}
                    className="">
                    <img
                        src={props.listing.imageUrls[0]}
                        alt="Listing image"
                        className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
                    />
                    <div className="p-3 flex flex-col gap-2 w-full">
                        <p className="truncate font-semibold text-stone-800">
                            {props.listing.name}
                        </p>
                        <div className="flex items-center gap-1 text-sm">
                            <FaMapLocationDot color="rgb(4 120 87)" />
                            <p className="text-stone-700">
                                {props.listing.address}
                            </p>
                        </div>
                        <p
                            className="line-clamp-3 text-sm text-stone-900"
                            style={{}}>
                            {props.listing.description}
                        </p>
                        <p>
                            Rs.{" "}
                            {props.listing.offer
                                ? props.listing.discountPrice.toLocaleString(
                                      "en-US"
                                  )
                                : props.listing.regularPrice.toLocaleString(
                                      "en-US"
                                  )}
                            {props.listing.type === "rent" && " / month"}
                        </p>
                        <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-1 bg-stone-600 text-white pb-1 pt-1 pl-2 pr-2 rounded-md">
                                <FaBed size={18} />
                                {props.listing.bedrooms > 1
                                    ? `${props.listing.bedrooms} beds`
                                    : `${props.listing.bedrooms} bed`}
                            </div>
                            <div className="flex items-center gap-1 bg-stone-600 text-white pb-1 pt-1 pl-2 pr-2 rounded-md">
                                <FaBath />
                                {props.listing.bathrooms > 1
                                    ? `${props.listing.bathrooms} baths`
                                    : `${props.listing.bathrooms} bath`}
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default ListingItem;
