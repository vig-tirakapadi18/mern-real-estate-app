import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import ListingItem from "./ListingItem";

const Home = () => {
    const [offerListing, setOfferListing] = useState([]);
    const [rentListing, setRentListing] = useState([]);
    const [saleListing, setSaleLIsting] = useState([]);

    SwiperCore.use([Navigation]);

    useEffect(() => {
        const fetchOfferListing = async () => {
            try {
                const response = await fetch(
                    "/api/listing/getListing?offer=true&limit=3"
                );
                const data = await response.json();
                setOfferListing(data);
                fetchRentListing();
            } catch (error) {
                console.log(error);
            }
        };

        const fetchRentListing = async () => {
            try {
                const response = await fetch(
                    "/api/listing/getListing?rent=true&limit=3"
                );
                const data = await response.json();
                setRentListing(data);
                fetchSaleListing();
            } catch (error) {
                console.log(error);
            }
        };

        const fetchSaleListing = async () => {
            try {
                const response = await fetch(
                    "/api/listing/getListing?sale=true&limit=3"
                );
                const data = await response.json();
                setSaleLIsting(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchOfferListing();
    }, []);

    return (
        <>
            <div className="font-semibold flex flex-col gap-4 p-28 px-3 max-w-6xl mx-auto">
                <h1 className="text-stone-700 font-bold text-3xl lg:text-6xl">
                    Find your next{" "}
                    <span className="text-stone-500">perfect</span>
                    <br />
                    place with ease!
                </h1>
                <div className="text-slate-600 text-xs sm:text-sm">
                    <span className="text-stone-700 font-bold">Vig Estate</span>{" "}
                    is the best way to find your next perfect place to live.
                    <br />
                    We have wide range of properties for you to choose from.
                </div>
                <Link
                    to={"/search"}
                    className="text-xs sm:text-sm text-blue-600 hover:underline">
                    Lets start now...
                </Link>
            </div>

            <Swiper navigation>
                {offerListing &&
                    offerListing.length > 0 &&
                    offerListing.map((listing) => (
                        <SwiperSlide key={listing._id}>
                            <div
                                style={{
                                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                                    backgroundSize: "cover",
                                }}
                                className="h-[500px]"></div>
                        </SwiperSlide>
                    ))}
            </Swiper>

            <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
                {/* OFFERS SECTION*/}
                {offerListing && offerListing.length > 0 && (
                    <div className="">
                        <div className="">
                            <h2 className="font-bold text-3xl text-stone-700">
                                Recent offers
                            </h2>
                            <Link
                                to={"/search?offer=true"}
                                className="text-sm text-blue-700 font-semibold hover:underline">
                                Show more offers
                            </Link>
                        </div>
                        <div className="flex flex-wrap justify-center">
                            {offerListing.map((listing) => (
                                <ListingItem
                                    listing={listing}
                                    key={listing._id}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* RENT SECTION */}
                {rentListing && rentListing.length > 0 && (
                    <div className="">
                        <div className="">
                            <h2 className="font-bold text-3xl text-stone-700">
                                Recent places for rent
                            </h2>
                            <Link
                                to={"/search?rent=true"}
                                className="text-sm text-blue-700 font-semibold hover:underline">
                                Show more places for rent
                            </Link>
                        </div>
                        <div className="flex flex-wrap justify-center">
                            {rentListing.map((listing) => (
                                <ListingItem
                                    listing={listing}
                                    key={listing._id}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* SALE SECTION */}
                {saleListing && saleListing.length > 0 && (
                    <div className="">
                        <div className="">
                            <h2 className="font-bold text-3xl text-stone-700">
                                Recent places for sale
                            </h2>
                            <Link
                                to={"/search?sale=true"}
                                className="text-sm text-blue-700 font-semibold hover:underline">
                                Show more places for sale
                            </Link>
                        </div>
                        <div className="flex flex-wrap justify-center">
                            {saleListing.map((listing) => (
                                <ListingItem
                                    listing={listing}
                                    key={listing._id}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
