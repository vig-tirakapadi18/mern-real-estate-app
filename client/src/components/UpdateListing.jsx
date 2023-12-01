import { FaBath, FaBed } from "react-icons/fa6";
import { MdDiscount } from "react-icons/md";
import { BiSolidDiscount } from "react-icons/bi";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import PulseLoading from "./UI/PulseLoading";

const UpdateListing = () => {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
        name: "",
        description: "",
        address: "",
        type: "rent",
        bedrooms: 1,
        bathrooms: 1,
        regularPrice: 5000,
        discountPrice: 0,
        offer: false,
        parking: 1,
        furnished: false,
    });
    const [imageUploadError, setImageUploadError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId;
            const response = await fetch(
                `/api/listing/getListing/${listingId}`
            );

            const data = await response.json();
            if (data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
        };
        fetchListing();
    }, []);

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
            setUploading(true);
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
                    setUploading(false);
                })
                .catch(() => {
                    setImageUploadError(
                        "Image upload failed! (Each image must be less than 1 MB)"
                    );
                    setUploading(false);
                });
        } else {
            setImageUploadError("Max 4 images are allowed per listing!");
            setUploading(false);
        }
    };

    const deleteImageHandler = (idx) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== idx),
        });
    };

    const inputChangeHandler = (event) => {
        if (event.target.id === "sale" || event.target.id === "rent") {
            setFormData({
                ...formData,
                type: event.target.id,
            });
        } else if (
            event.target.id === "parking" ||
            event.target.id === "furnished" ||
            event.target.id === "offer"
        ) {
            setFormData({
                ...formData,
                [event.target.id]: event.target.checked,
            });
        } else if (
            event.target.type === "number" ||
            event.target.type === "text" ||
            event.target.type === "textarea"
        ) {
            setFormData({
                ...formData,
                [event.target.id]: event.target.value,
            });
        }
    };

    const formSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            if (formData.imageUrls.length <= 0)
                return setError("Atleast one image is required!");
            if (+formData.regularPrice <= +formData.discountPrice)
                return setError(
                    "Regular price must be greater than Discounted price!"
                );
            setLoading(true);
            setError(false);

            const response = await fetch(
                `/api/listing/update/${params.listingId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        ...formData,
                        userRef: currentUser._id,
                    }),
                }
            );
            const data = await response.json();
            if (data.success === false) {
                setError(data.message);
            }

            navigate(`/listing/${data._id}`);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <main className="p-3 max-w-4xl mx-auto text-stone-800">
            <h1 className="text-center  font-semibold text-3xl uppercase my-7">
                Update A Listing
            </h1>
            <form
                onSubmit={formSubmitHandler}
                className="flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col gap-1 flex-1">
                    <input
                        type="text"
                        id="name"
                        placeholder="Name"
                        className="p-3 rounded-lg bg-stone-100 outline-none my-2 text-lg"
                        maxLength="62"
                        minLength="10"
                        required
                        onChange={inputChangeHandler}
                        value={formData.name}
                    />
                    <textarea
                        type="text"
                        id="description"
                        placeholder="Description"
                        className="p-3 rounded-lg bg-stone-100 outline-none my-2 text-lg"
                        required
                        onChange={inputChangeHandler}
                        value={formData.description}
                    />
                    <input
                        type="text"
                        id="address"
                        placeholder="Address"
                        className="p-3 rounded-lg bg-stone-100 outline-none my-2 text-lg"
                        required
                        onChange={inputChangeHandler}
                        value={formData.address}
                    />
                    <div className="flex gap-6 flex-wrap">
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="sale"
                                className="w-5"
                                onChange={inputChangeHandler}
                                checked={formData.type === "sale"}
                            />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="rent"
                                className="w-5"
                                onChange={inputChangeHandler}
                                value={formData.type}
                                checked={formData.type === "rent"}
                            />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="parking"
                                className="w-5"
                                onChange={inputChangeHandler}
                                value={formData.parking}
                                checked={formData.parking}
                            />
                            <span>Parking spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="furnished"
                                className="w-5"
                                onChange={inputChangeHandler}
                                checked={formData.furnished}
                            />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="checkbox"
                                id="offer"
                                className="w-5"
                                onChange={inputChangeHandler}
                                value={formData.offer}
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
                                onChange={inputChangeHandler}
                                value={formData.bedrooms}
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
                                onChange={inputChangeHandler}
                                value={formData.bathrooms}
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
                                min="5000"
                                max="100000000"
                                className="p-3 rounded-lg"
                                onChange={inputChangeHandler}
                                value={formData.regularPrice}
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
                        {formData.offer && (
                            <div className="flex items-center gap-2 my-1">
                                <input
                                    type="number"
                                    id="discountPrice"
                                    min="0"
                                    max="100000"
                                    className="p-3 rounded-lg"
                                    onChange={inputChangeHandler}
                                    value={formData.discountPrice}
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
                        )}
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
                            {uploading ? <PulseLoading /> : "Upload"}
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

                    <button
                        disabled={loading || uploading}
                        className="p-3 bg-stone-700 uppercase text-white my-5 rounded-lg text-lg hover:opacity-95 disabled:opacity-80">
                        {loading ? <PulseLoading /> : "Update Listing"}
                    </button>
                    {error && <p className="text-red-700 text-sm">{error}</p>}
                </div>
            </form>
        </main>
    );
};

export default UpdateListing;
