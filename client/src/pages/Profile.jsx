import { Fragment } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <Fragment>
            <h1 className="text-center my-5 font-semibold text-4xl uppercase text-stone-700">
                Update / Create Listing
            </h1>
            <img
                src={currentUser.photo}
                alt={currentUser.username}
                className="mx-auto my-6 rounded-full w-34 object-cover cursor-pointer"
            />
            <form className="flex flex-col max-w-md mx-auto">
                <input
                    type="text"
                    className="my-2 p-3 rounded-lg bg-stone-100 text-lg outline-none"
                    value={currentUser.username}
                    placeholder="Username"
                />
                <input
                    type="text"
                    className="my-2 p-3 rounded-lg bg-stone-100 text-lg outline-none"
                    value={currentUser.email}
                    placeholder="Email"
                />
                <input
                    type="text"
                    className="my-2 p-3 rounded-lg bg-stone-100 text-lg outline-none"
                    placeholder="Password"
                />
                <button
                    type="button"
                    className="bg-stone-700 text-white uppercase p-3 rounded-lg my-2 hover:opacity-95 text-lg disabled:opacity-80">
                    Update
                </button>
                {/* <button
                    type="button"
                    className="bg-emerald-700 text-white uppercase p-3 rounded-lg my-2 hover:opacity-95 text-lg">
                    Create Listing
                </button> */}

                <div className="flex justify-between text-red-700 text-lg">
                    <p>Delete account</p>
                    <p>Sign out</p>
                </div>
                {/* <p className="text-center my-3 text-lg text-emerald-700">
                    Show listings
                </p> */}
            </form>
        </Fragment>
    );
};

export default Profile;
