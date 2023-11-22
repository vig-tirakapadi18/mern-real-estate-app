import { FaSearch } from "react-icons/fa";

const Search = () => {
    return (
        <div className="flex flex-col md:flex-row text-lg">
            <div className="p-7 border-b-2 md:border-r-2 border-stone-400 md:min-h-screen">
                <form className="">
                    <div className="flex items-center gap-2 my-6">
                        <label className="whitespace-nowrap font-semibold">
                            Search Term:{" "}
                        </label>
                        <input
                            type="text"
                            placeholder="Search..."
                            id="searchTerm"
                            className="p-3 w-full bg-stone-100 rounded-lg outline-none border border-stone-300"
                        />
                    </div>
                    <div className="flex gap-3 my-6">
                        <label className="font-semibold">Type:</label>
                        <div className="flex gap-1 flex-wrap">
                            <input
                                type="checkbox"
                                id="all"
                                className="w-5"
                            />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-1">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-1">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                            />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-1">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
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
                            />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-1">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                            />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className="flex gap-2 items-center">
                        <label className="font-semibold">Sort:</label>
                        <select
                            id="sort"
                            className="p-2 rounded-md outline-none border border-stone-300">
                            <option value="latest">Latest</option>
                            <option value="latest">Price high to low</option>
                            <option value="latest">Price low to high</option>
                            <option value="latest">Oldest</option>
                        </select>
                    </div>
                    <button className="flex justify-center items-center gap-2 my-6 text-center bg-stone-700 p-3 w-full text-white uppercase text-lg rounded-lg hover:opacity-95">
                        <FaSearch /> Search
                    </button>
                </form>
            </div>
            <div>
                <h1 className="text-3xl font-semibold text-stone-800 p-3 border-b border-stone-300 mt-3">
                    Listing results:{" "}
                </h1>
            </div>
        </div>
    );
};

export default Search;
