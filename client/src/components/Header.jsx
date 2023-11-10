import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-stone-200 shadow-md">
            <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
                <Link to="/">
                    <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
                        <span className="text-stone-500">Vig</span>
                        <span className="text-stone-700">Estate</span>
                    </h1>
                </Link>
                <form className="bg-stone-100 p-3 rounded-lg flex items-center/">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none  w-24 sm:w-64"
                    />
                    <FaSearch
                        size={20}
                        className="text-stone-600"
                    />
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
                    <Link to="/sign-in">
                        <li className="text-stone-700 hover:underline hover:cursor-pointer">
                            Sign In
                        </li>
                    </Link>
                </ul>
            </div>
        </header>
    );
};

export default Header;
