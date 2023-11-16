/* eslint-disable react/jsx-key */
import { FaBath, FaBed } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
import { BiSolidDiscount } from "react-icons/bi";
import { useState } from "react";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import doubleRing from "../assets/double-ring.svg";

const CreateListing = () => {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    });
    const [imageUploadError, setImageUploadError] = useState(null);
    const [loading, setLoading] = useState(false);

    console.log(formData);

    const storeImages = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done!`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                        (downloadUrl) => {
                            resolve(downloadUrl);
                        }
                    );
                }
            );
        });
    };

    const imageSubmitHandler = () => {
        if (files.length > 0 && files.length + formData.imageUrls.length <= 4) {
            setLoading(true);
            setImageUploadError(false);

            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImages(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    });
                    setImageUploadError(false);
                    setLoading(false);
                })
                .catch(() => {
                    setImageUploadError(
                        "Image upload failed! (Each image must be less than 1 MB)"
                    );
                    setLoading(false);
                });
        } else {
            setImageUploadError("Max 4 images are allowed per listing!");
            setLoading(false);
        }
    };

    const deleteImageHandler = (idx) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== idx),
        });
    };

    return (
        <main className="p-3 max-w-4xl mx-auto text-stone-800">
            <h1 className="text-center  font-semibold text-3xl uppercase my-7">
                Create A Listing
            </h1>
            <form className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col gap-1 flex-1">
                    <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        className="p-3 rounded-lg bg-stone-100 outline-none my-2 text-lg"
                        maxLength="62"
                        minLength="10"
                        required
                    />
                    <textarea
                        type="text"
                        id="description"
                        placeholder="Description"
                        className="p-3 rounded-lg bg-stone-100 outline-none my-2 text-lg"
                        required
                    />
                    <input
                        type="text"
                        id="address"
                        placeholder="Address"
                        className="p-3 rounded-lg bg-stone-100 outline-none my-2 text-lg"
                        required
                    />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                            />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-8 flex-wrap">
                        <div className="flex items-center gap-2 my-1">
                            <input
                                type="number"
                                id="bedrooms"
                                min="1"
                                max="10"
                                className="p-3 rounded-lg"
                            />
                            <span className="flex gap-1 items-center">
                                <FaBed
                                    color="rgba(68, 64, 60)"
                                    size={22}
                                />
                                Beds
                            </span>
                        </div>
                        <div className="flex items-center gap-2 my-1">
                            <input
                                type="number"
                                id="bathrooms"
                                min="1"
                                max="10"
                                className="p-3 rounded-lg"
                            />
                            <span className="flex gap-1 items-center">
                                <FaBath
                                    color="rgba(68, 64, 60)"
                                    size={20}
                                />
                                Baths
                            </span>
                        </div>
                        <div className="flex items-center gap-2 my-1">
                            <input
                                type="number"
                                id="regularPrice"
                                min="1"
                                max="10"
                                className="p-3 rounded-lg"
                            />
                            <div className="flex gap-1 items-center">
                                <MdDiscount
                                    color="rgba(68, 64, 60)"
                                    size={24}
                                />
                                <div className="text-center">
                                    <p>Regular Price</p>
                                    <span className="text-xs">
                                        (Rs / month)
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 my-1">
                            <input
                                type="number"
                                id="discountPrice"
                                min="1"
                                max="10"
                                className="p-3 rounded-lg"
                            />
                            <div className="flex gap-1 items-center">
                                <BiSolidDiscount
                                    color="rgba(68, 64, 60)"
                                    size={28}
                                />
                                <div className="text-center">
                                    <p>Discounted Price</p>
                                    <span className="text-xs">
                                        (Rs / month)
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1">
                    <p className="font-semibold">
                        Images:
                        <span className="font-normal text-gray-600 ml-2">
                            The first page will be the cover (max 4)
                        </span>
                    </p>
                    <div className="flex gap-4">
                        <input
                            type="file"
                            id="images"
                            accept="image/*"
                            multiple
                            className="p-3 border border-gray-400 w-full"
                            onChange={(event) => setFiles(event.target.files)}
                        />
                        <button
                            type="button"
                            onClick={imageSubmitHandler}
                            className="p-3 bg-emerald-600 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80 text-sm hover:shadow-lg">
                            {loading ? (
                                <div>
                                    <img
                                        src={doubleRing}
                                        alt="loading"
                                        className="w-10"
                                    />
                                </div>
                            ) : (
                                "Upload"
                            )}
                        </button>
                    </div>
                    <p className="text-red-700 mt-2 text-sm">
                        {imageUploadError && imageUploadError}
                    </p>
                    {formData.imageUrls.length > 0 &&
                        formData.imageUrls.map((url, idx) => {
                            return (
                                <div
                                    key={url}
                                    className="flex justify-between my-2 border border-stone-400 p-3 items-center">
                                    <img
                                        src={url}
                                        alt="listing image"
                                        className="w-30 h-20 rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => deleteImageHandler(idx)}
                                        className="bg-rose-700 text-white uppercase text- top-0 right-0 pl-3 pr-3 pt-1.5 pb-1.5 rounded-lg hover:opacity-95">
                                        Delete
                                    </button>
                                </div>
                            );
                        })}

                    <button className="p-3 bg-stone-700 uppercase text-white my-5 rounded-lg text-lg hover:opacity-95 disabled:opacity-80">
                        Create Listing
                    </button>
                </div>
            </form>
        </main>
    );
};

export default CreateListing;
