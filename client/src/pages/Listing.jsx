import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

import PulseLoading from "../components/UI/PulseLoading";

const Listing = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);

    console.log(listing);

    const params = useParams();

    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const res = await fetch(
                    `/api/listing/getListing/${params.listingId}`,
                    {
                        method: "GET", // DEFAULT MATHOD
                    }
                );
                const data = await res.json();
                if (data.success === false) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        };
        fetchListing();
    }, [params.listingId]);

    return (
        <main>
            {loading && <PulseLoading width="w-26" />}
            {error && (
                <p className="text-center my-4 font-semibold text-3xl text-rose-700">
                    Something went wrong!
                </p>
            )}
            {listing && !loading && !error && (
                <>
                    <Swiper navigation>
                        {listing.imageUrls.map((imageUrl) => (
                            <SwiperSlide key={imageUrl}>
                                <div
                                    className="h-[550px]"
                                    style={{
                                        background: `url(${imageUrl}) center no-repeat`,
                                    }}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            )}
        </main>
    );
};

export default Listing;
