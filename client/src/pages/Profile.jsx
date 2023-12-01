import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiImageAddFill, RiUploadCloud2Fill } from "react-icons/ri";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { Link } from "react-router-dom";
import { app } from "../firebase";
import {
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signoutUserFailure,
    signoutUserStart,
    signoutUserSuccess,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
} from "../store/user/userSlice";
import PulseLoading from "../components/UI/PulseLoading";

const Profile = () => {
    const [uploadImg, setImgUpload] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [showListingError, setShowListingError] = useState(false);
    const [userListings, setUserListings] = useState([]);

    const imgUploadRef = useRef();
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        if (uploadImg) imgUploadHandler(uploadImg);
    }, [uploadImg]);

    const imgUploadHandler = (uploadImg) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + uploadImg.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, uploadImg);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                console.log(error);
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setFormData({ ...formData, photo: downloadURL });
                });
            }
        );
    };

    const inputChangeHandler = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    };

    const submitHandler = async (event) => {
        event.preventDefault();

        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (data.success === false) {
                dispatch(updateUserFailure(data.message));
                return;
            }

            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
        } catch (error) {
            dispatch(updateUserFailure(error.message));
        }
    };

    const deleteUserHandler = async () => {
        try {
            dispatch(deleteUserStart());

            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.success === false) {
                dispatch(deleteUserFailure(data.message));
                return;
            }

            dispatch(deleteUserSuccess(data));
        } catch (error) {
            dispatch(deleteUserFailure(error.message));
        }
    };

    const signoutUserHandler = async () => {
        try {
            dispatch(signoutUserStart());
            const res = await fetch("/api/auth/signout");
            const data = await res.json();

            if (data.success === false) {
                dispatch(signoutUserFailure(data.message));
                return;
            }

            dispatch(signoutUserSuccess(data));
        } catch (error) {
            dispatch(signoutUserFailure(error.message));
        }
    };

    const showListingHandler = async () => {
        try {
            setShowListingError(false);
            const res = await fetch(`/api/user/listings/${currentUser._id}`);
            const data = await res.json();
            if (data.success === false) {
                setShowListingError(true);
                return;
            }

            setUserListings(data);
        } catch (error) {
            setShowListingError(true);
        }
    };

    const deleteListingHandler = async (listingId) => {
        try {
            const res = await fetch(`/api/listing/delete/${listingId}`, {
                method: "DELETE",
            });

            const data = await res.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }

            setUserListings((prev) =>
                prev.filter((listing) => listing._id !== listingId)
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    return (
        <Fragment>
            <h1 className="text-center mt-5 font-semibold text-4xl uppercase text-stone-700">
                Update / Create Listing
            </h1>
            <form
                onSubmit={submitHandler}
                className="flex flex-col max-w-md mx-auto">
                <div className="">
                    <input
                        type="file"
                        ref={imgUploadRef}
                        hidden
                        accept="image/*"
                        onChange={(event) =>
                            setImgUpload(event.target.files[0])
                        }
                    />
                    <img
                        src={formData.photo || currentUser.photo}
                        alt={currentUser.username}
                        className="mx-auto mt-6 mb-1  rounded-full w-36 object-cover cursor-pointer border-4 border-stone-700"
                        onClick={() => imgUploadRef.current.click()}
                    />
                    {!uploadImg ? (
                        <div
                            className="my-2 flex justify-center items-center gap-1 text-center font-semibold bg-blue-700 w-28 text-white mx-auto p-1 rounded-md cursor-pointer"
                            onClick={() => imgUploadRef.current.click()}>
                            <RiImageAddFill size={22} />
                            Edit
                        </div>
                    ) : (
                        ""
                    )}

                    <p className="text-center my-4 font-semibold">
                        {fileUploadError ? (
                            <span className="text-red-700">
                                Error: Failed to upload image!(Must be less than
                                1MB)
                            </span>
                        ) : filePerc > 0 && filePerc < 100 ? (
                            <span className=" flex gap-1 justify-center text-blue-700">
                                <RiUploadCloud2Fill size={24} />
                                {`Uploading ${filePerc}%`}
                            </span>
                        ) : filePerc === 100 ? (
                            <span className="text-green-700 ">
                                Image uploaded successfully!
                            </span>
                        ) : (
                            ""
                        )}
                    </p>
                </div>

                <input
                    type="text"
                    id="username"
                    className="my-2 p-3 rounded-lg bg-stone-100 text-lg outline-none"
                    defaultValue={currentUser.username}
                    placeholder="Username"
                    onChange={inputChangeHandler}
                />
                <input
                    type="email"
                    id="email"
                    className="my-2 p-3 rounded-lg bg-stone-100 text-lg outline-none"
                    defaultValue={currentUser.email}
                    placeholder="Email"
                    onChange={inputChangeHandler}
                />
                <input
                    type="password"
                    id="password"
                    className="my-2 p-3 rounded-lg bg-stone-100 text-lg outline-none"
                    placeholder="Password"
                    onChange={inputChangeHandler}
                />
                <button
                    disabled={loading}
                    className="bg-stone-700 text-white uppercase p-3 rounded-lg my-2 hover:opacity-95 text-lg disabled:opacity-80">
                    {loading ? <PulseLoading /> : "Update"}
                </button>

                <Link
                    to={"/create-listing"}
                    className="text-center my-2 p-3 bg-emerald-700 text-white uppercase text-lg rounded-lg hover:opacity-95">
                    Create Listing
                </Link>

                <div className="flex justify-between text-red-700 text-lg">
                    <p
                        onClick={deleteUserHandler}
                        className="cursor-pointer">
                        Delete account
                    </p>
                    <p
                        onClick={signoutUserHandler}
                        className="cursor-pointer">
                        Sign out
                    </p>
                </div>

                <p className="text-red-700 mt-2">{error ? error : ""}</p>
                <p className="text-green-700 mt-2">
                    {updateSuccess ? "User updated successfully!" : ""}
                </p>
                <button
                    type="button"
                    onClick={showListingHandler}
                    className="text-center text-lg text-emerald-700 font-semibold">
                    Show listings
                </button>

                <p className="text-red-700">
                    {showListingError ? "Error showing listings!" : ""}
                </p>
                {userListings && userListings.length > 0 && (
                    <div className="">
                        <h1 className="uppercase my-4 text-center text-stone-700 font-semibold text-3xl">
                            Your Listings
                        </h1>
                        {userListings.map((listing) => (
                            <div
                                key={listing._id}
                                className="border border-stone-400 my-1 px-3 flex items-center justify-between gap-4">
                                <Link to={`/listing/${listing._id}`}>
                                    <img
                                        src={listing.imageUrls[0]}
                                        alt="listing image"
                                        className="w-20 h-20 object-contain rounded-md"
                                    />
                                </Link>
                                <Link
                                    className="text-stone-700 font-semibold flex-1 hover:underline truncate"
                                    to={`/listing/${listing._id}`}>
                                    <p>{listing.name}</p>
                                </Link>

                                <div className="flex flex-col gap-1">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            deleteListingHandler(listing._id)
                                        }
                                        className="uppercase bg-rose-700 pl-2 pr-2 pt-1 pb-1 text-sm text-white rounded-md">
                                        Delete
                                    </button>
                                    <Link
                                        to={`/update-listing/${listing._id}`}
                                        className="text-center">
                                        <button
                                            type="button"
                                            className="uppercase bg-emerald-700 pl-2 pr-2 pt-1 pb-1 text-sm text-white rounded-md">
                                            Edit
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </form>
        </Fragment>
    );
};

export default Profile;
