import { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RiImageAddFill, RiUploadCloud2Fill } from "react-icons/ri";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const Profile = () => {
    const [uploadImg, setImgUpload] = useState(undefined);
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const [formData, setFormData] = useState({});

    const imgUploadRef = useRef();
    const { currentUser } = useSelector((state) => state.user);

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

    useEffect(() => {
        if (uploadImg) imgUploadHandler(uploadImg);
    }, [uploadImg]);

    return (
        <Fragment>
            <h1 className="text-center my-5 font-semibold text-4xl uppercase text-stone-700">
                Update / Create Listing
            </h1>
            <div className="">
                <input
                    type="file"
                    ref={imgUploadRef}
                    hidden
                    accept="image/*"
                    onChange={(event) => setImgUpload(event.target.files[0])}
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
                            2MB)
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
