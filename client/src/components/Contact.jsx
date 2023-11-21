/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { Link } from "react-router-dom";

const Contact = (props) => {
    const [landlord, setLandlord] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchLandlord = async () => {
            const res = await fetch(`/api/user/${props.listing.userRef}`);
            const data = await res.json();
            setLandlord(data);
        };
        fetchLandlord();
    }, [props.listing.userRef]);

    const inputChangeHandler = (event) => {
        setMessage(event.target.value);
    };

    return (
        <>
            {landlord && (
                <div>
                    <p>
                        Contact{" "}
                        <span className="font-semibold text-stone-800">
                            {landlord.username}
                        </span>{" "}
                        for{" "}
                        <span className="font-semibold text-stone-800">
                            {props.listing.name}
                        </span>
                    </p>
                    <textarea
                        name="message"
                        id="message"
                        rows="2"
                        value={message}
                        placeholder="Enter your message here..."
                        onChange={inputChangeHandler}
                        className="bg-stone-100 border border-stone-600 w-full p-2 rounded-md outline-none my-1"></textarea>
                    <Link
                        className="flex items-center gap-1 text-white bg-blue-600 p-3 uppercase justify-center text-lg rounded-lg"
                        to={`mailto:${landlord.email}?subject=Regarding ${props.listing.name}&body=${message}`}>
                        <FaTelegramPlane size={24} />
                        Send Message
                    </Link>
                </div>
            )}
        </>
    );
};

export default Contact;
