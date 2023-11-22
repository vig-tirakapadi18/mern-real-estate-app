import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

const Header = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromURL = urlParams.get("searchTerm");
        if (searchTermFromURL) {
            setSearchTerm(searchTermFromURL);
        }
    }, []);

    const submitHandler = (event) => {
        event.preventDefault();

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <header className="bg-stone-200 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-stone-500">Vig</span>
                        <span className="text-stone-700">Estate</span>
                    </h1>
                </Link>
                <form
                    onSubmit={submitHandler}
                    className="bg-stone-100 p-3 rounded-lg flex items-center/">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none  w-24 sm:w-64"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                    />
                    <button>
                        <FaSearch
                            size={20}
                            className="text-stone-600"
                        />
                    </button>
                </form>
                <ul className="flex gap-4">
                    <Link to="/">
                        <li className="hidden sm:inline text-stone-700 hover:underline hover:cursor-pointer">
                            Home
                        </li>
                    </Link>
                    <Link to="/about">
                        <li className="hidden sm:inline text-stone-700 hover:underline hover:cursor-pointer">
                            About
                        </li>
                    </Link>
                    <Link to="/profile">
                        {currentUser ? (
                            <img
                                src={currentUser.photo}
                                alt={currentUser.username}
                                className="w-7 h-7 object-cover rounded-full"
                            />
                        ) : (
                            <li className="text-stone-700 hover:underline hover:cursor-pointer">
                                Sign In
                            </li>
                        )}
                    </Link>
                </ul>
            </div>
        </header>
    );
};

export default Header;
