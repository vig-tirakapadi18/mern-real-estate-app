import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
    FaMapLocationDot,
    FaBed,
    FaBath,
    FaSquareParking,
} from "react-icons/fa6";
import { FaShare, FaHome } from "react-icons/fa";
import { MdChair } from "react-icons/md";
import { BiSolidDiscount } from "react-icons/bi";

import PulseLoading from "../components/UI/PulseLoading";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

const Listing = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [copied, setCopied] = useState(false);
    const [contact, setContact] = useState(false);

    const params = useParams();

    const { currentUser } = useSelector((state) => state.user);

    SwiperCore.use([Navigation]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/listing/getListing/${params.listingId}`
                );
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    return (
        <main>
            {loading && <PulseLoading width="w-26" />}
            {error && (
                <p className="text-center my-4 font-semibold text-3xl text-rose-700">
                    Something went wrong!
                </p>
            )}
            {listing && !loading && !error && (
                <>
                    <Swiper navigation>
                        {listing.imageUrls.map((imageUrl) => (
                            <SwiperSlide key={imageUrl}>
                                <div
                                    className="h-[400px]"
                                    style={{
                                        background: `url(${imageUrl}) center no-repeat`,
                                        backgroundSize: "cover",
                                    }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className="fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer">
                        <FaShare
                            className="text-stone-500"
                            onClick={() => {
                                navigator.clipboard.writeText(
                                    window.location.href
                                );
                                setTimeout(() => {
                                    setCopied(false);
                                }, 2000);
                            }}
                        />
                    </div>

                    {copied && (
                        <p className="fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2">
                            Link copied!
                        </p>
                    )}

                    <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                        <p className="text-2xl font-semibold text-stone-800">
                            {listing.name} - Rs{" "}
                            {listing.offer
                                ? listing.discountPrice.toLocaleString("en-US")
                                : listing.regularPrice.toLocaleString("en-US")}
                            {listing.type === "rent" && " / month"}
                        </p>

                        <p className="flex items-center mt-6 gap-2 text-stone-700  text-sm">
                            <FaMapLocationDot
                                className="text-emerald-600"
                                size={20}
                            />
                            {listing.address}
                        </p>
                        <div className="flex gap-5">
                            <div className="bg-red-700  w-[200px] text-center uppercase text-white p-1 rounded-full">
                                <div className="flex justify-center items-center gap-1">
                                    <FaHome />
                                    {listing.type === "rent"
                                        ? "For Rent"
                                        : "For Sale"}
                                </div>
                            </div>
                            {listing.offer && (
                                <p className="bg-emerald-700 w-[200px] text-center p-1 rounded-full text-white flex justify-center items-center gap-1">
                                    <BiSolidDiscount size={18} />
                                    Rs.{" "}
                                    {+listing.regularPrice -
                                        +listing.discountPrice}{" "}
                                    OFF /-
                                </p>
                            )}
                        </div>
                        <p className="text-stone-900">
                            <span className="font-semibold text-black">
                                Description:{" "}
                            </span>
                            {listing.description}
                        </p>

                        <ul className="font-semibold whitespace-nowrap flex gap-2 items-center flex-wrap">
                            <li className="flex items-center gap-2 bg-green-700 pt-1 pb-1 pl-4 pr-4 text-white rounded-md">
                                <FaBed size={20} />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} Beds`
                                    : `${listing.bedrooms} Bed`}
                            </li>
                            <li className="flex gap-2 items-center  bg-green-700 pt-1 pb-1 pl-4 pr-4 text-white rounded-md">
                                <FaBath size={20} />
                                {listing.bathrooms > 1
                                    ? `${listing.bedrooms} Baths`
                                    : `${listing.bedrooms} Bath`}
                            </li>
                            <li className="flex gap-2 items-center  bg-green-700 pt-1 pb-1 pl-4 pr-4 text-white rounded-md">
                                <div className="flex gap-2 items-center">
                                    <FaSquareParking size={20} />
                                    {listing.parking
                                        ? "Parking spot"
                                        : "No Parking"}
                                </div>
                            </li>
                            <li className="flex gap-2 items-center  bg-green-700 pt-1 pb-1 pl-4 pr-4 text-white rounded-md">
                                <div className="flex items-center gap-2">
                                    <MdChair size={20} />
                                    {listing.furnished
                                        ? "Furnished"
                                        : "Unfurnished"}
                                </div>
                            </li>
                        </ul>
                        {currentUser &&
                            listing.userRef !== currentUser._id &&
                            !contact && (
                                <button
                                    onClick={() => setContact(true)}
                                    className="my-4 p-3 bg-stone-700 text-center text-white uppercase rounded-lg hover:opacity-95 text-lg">
                                    Contact Landlord
                                </button>
                            )}
                        {contact && <Contact listing={listing} />}
                    </div>
                </>
            )}
        </main>
    );
};

export default Listing;
