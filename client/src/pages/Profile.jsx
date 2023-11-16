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
import loader from "../assets/pulse.svg";

const Profile = () => {
    const [uploadImg, setImgUpload] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);

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
            console.log(currentUser);
            const response = await fetch(
                `/api/user/update/${currentUser._id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );
            const data = await response.json();
            console.log(data);

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

            const response = await fetch(
                `/api/user/delete/${currentUser._id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();
            if (data.message === false) {
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
            const response = await fetch("/api/auth/signout");
            const data = await response.json();

            if (data.success === false) {
                dispatch(signoutUserFailure(data.message));
                return;
            }

            dispatch(signoutUserSuccess(data));
        } catch (error) {
            dispatch(signoutUserFailure(error.message));
        }
    };

    return (
        <Fragment>
            <h1 className="text-center my-5 font-semibold text-4xl uppercase text-stone-700">
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
                    {loading ? (
                        <div>
                            <img
                                src={loader}
                                className="mx-auto w-[50px]"
                            />
                        </div>
                    ) : (
                        "Update"
                    )}
                </button>
                {/* <button
                    type="button"
                    className="bg-emerald-700 text-white uppercase p-3 rounded-lg my-2 hover:opacity-95 text-lg">
                    Create Listing
                </button> */}
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

                <p className="text-red-700 mt-5">{error ? error : ""}</p>
                <p className="text-green-700 mt-5">
                    {updateSuccess ? "User updated successfully!" : ""}
                </p>
                {/* <p className="text-center my-3 text-lg text-emerald-700">
                    Show listings
                </p> */}
            </form>
        </Fragment>
    );
};

export default Profile;
