import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import PulseLoading from "../components/UI/PulseLoading";
import ListingItem from "./ListingItem";

const Search = () => {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: "created_at",
        order: "desc",
    });
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState([]);
    const [showMore, setShowMore] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromURL = urlParams.get("searchTerm");
        const typeFromURL = urlParams.get("type");
        const parkingFromURL = urlParams.get("parking");
        const furnishedFromURL = urlParams.get("furnished");
        const offerFromURL = urlParams.get("offer");
        const sortFromURL = urlParams.get("sort");
        const orderFromURL = urlParams.get("order");

        if (
            searchTermFromURL ||
            typeFromURL ||
            parkingFromURL ||
            furnishedFromURL ||
            offerFromURL ||
            sortFromURL ||
            orderFromURL
        ) {
            setSidebarData({
                searchTerm: searchTermFromURL || "",
                type: typeFromURL || "all",
                parking: parkingFromURL === "true" ? true : false,
                furnished: furnishedFromURL === "true" ? true : false,
                offer: offerFromURL === "true" ? true : false,
                sort: sortFromURL || "created_at",
                order: orderFromURL || "desc",
            });
        }

        const fetchListing = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const response = await fetch(
                `/api/listing/getListing?${searchQuery}`
            );
            const data = await response.json();
            if (data.length > 3) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListing(data);
            setLoading(false);
        };

        fetchListing();
    }, []);

    const inputChangeHandler = (event) => {
        if (
            event.target.id === "all" ||
            event.target.id === "rent" ||
            event.target.id === "sale"
        ) {
            setSidebarData({ ...sidebarData, type: event.target.id });
        } else if (event.target.id === "searchTerm") {
            setSidebarData({ ...sidebarData, searchTerm: event.target.value });
        } else if (
            event.target.id === "parking" ||
            event.target.id === "furnished" ||
            event.target.id === "offer"
        ) {
            setSidebarData({
                ...sidebarData,
                [event.target.id]:
                    event.target.checked || event.target.checked === "true"
                        ? true
                        : false,
            });
        } else if (event.target.id == "sort_order") {
            const sort = event.target.value.split("_")[0] || "created_at";
            const order = event.target.value.split("_")[1] || "desc";

            setSidebarData({ ...sidebarData, sort, order });
        }
    };

    const submitHandler = (event) => {
        event.preventDefault();

        const urlParams = new URLSearchParams();
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("type", sidebarData.type);
        urlParams.set("parking", sidebarData.parking);
        urlParams.set("furnished", sidebarData.furnished);
        urlParams.set("offer", sidebarData.offer);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("order", sidebarData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const showMoreListingHandler = async () => {
        const numberOfListings = listing.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        const response = await fetch(`/api/listing/getListing?${searchQuery}`);
        const data = await response.json();
        if (data.length < 4) setShowMore(false);
        setListing([...listing, ...data]);
    };

    return (
        <div className="flex flex-col md:flex-row text-lg">
            <div className="p-7 border-b-2 md:border-r-2 border-stone-400 md:min-h-screen flex-1">
                <form
                    onSubmit={submitHandler}
                    className="">
                    <div className="flex items-center gap-2 my-6">
                        <label className="whitespace-nowrap font-semibold">
                            Search Term:{" "}
                        </label>
                        <input
                            type="text"
                            placeholder="Search..."
                            id="searchTerm"
                            className="p-3 w-full bg-stone-100 rounded-lg outline-none border border-stone-300"
                            value={sidebarData.searchTerm}
                            onChange={inputChangeHandler}
                        />
                    </div>
                    <div className="flex gap-3 my-6 flex-wrap">
                        <label className="font-semibold">Type:</label>
                        <div className="flex gap-1 flex-wrap">
                            <input
                                type="checkbox"
                                id="all"
                                className="w-5"
                                checked={sidebarData.type === "all"}
                                onChange={inputChangeHandler}
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-1">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                checked={sidebarData.type === "rent"}
                                onChange={inputChangeHandler}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-1">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                checked={sidebarData.type === "sale"}
                                onChange={inputChangeHandler}
                            />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-1">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                checked={sidebarData.offer}
                                onChange={inputChangeHandler}
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-3 my-6">
                        <label className="font-semibold">Amenities:</label>
                        <div className="flex gap-1">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                checked={sidebarData.parking}
                                onChange={inputChangeHandler}
                            />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-1">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                checked={sidebarData.furnished}
                                onChange={inputChangeHandler}
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="font-semibold">Sort:</label>
                        <select
                            defaultValue={"created_at_desc"}
                            onChange={inputChangeHandler}
                            id="sort_order"
                            className="p-2 rounded-md outline-none border border-stone-300">
                            <option value={"createdAt_desc"}>Latest</option>
                            <option value={"regularPrice_desc"}>
                                Price high to low
                            </option>
                            <option value={"regulatPrice_asc"}>
                                Price low to high
                            </option>
                            <option value={"createdAt_asc"}>Oldest</option>
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="flex justify-center items-center gap-2 my-6 text-center bg-stone-700 p-3 w-full text-white uppercase text-lg rounded-lg hover:opacity-95">
                        <FaSearch /> Search
                    </button>
                </form>
            </div>
            <div className="md:w-[60rem] sm:flex-col">
                <div className="flex-1">
                    <h1 className="text-3xl font-semibold text-stone-800 p-3 border-b border-stone-300 mt-3">
                        Listing results:{" "}
                    </h1>
                </div>
                <div>
                    {!loading && listing.length === 0 && (
                        <p className="text-xl text-rose-700 my-[7rem]">
                            No listings found!
                        </p>
                    )}
                    {loading && (
                        <div className="my-[7rem]">
                            {" "}
                            <PulseLoading width="w-40" />
                        </div>
                    )}
                    {!loading &&
                        listing &&
                        listing.map((listing) => (
                            <ListingItem
                                key={listing._id}
                                listing={listing}
                            />
                        ))}

                    {showMore && (
                        <button
                            onClick={showMoreListingHandler}
                            className="text-emerald-700 hover:underline text-center w-full mb-6">
                            Show more
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;
