import { Fragment } from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../store/user/userSlice";

const OAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const googleClickHandler = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);
            const result = await signInWithPopup(auth, provider);

            const response = await fetch("api/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL,
                }),
            });

            const data = await response.json();
            dispatch(signInSuccess(data));

            navigate("/");
        } catch (error) {
            console.log("Could not sign in with Google!", error);
        }
    };

    return (
        <Fragment>
            <button
                type="button"
                onClick={googleClickHandler}
                className="flex justify-center items-center text-lg uppercase gap-1 bg-red-600 text-white p-3 rounded-lg hover:opacity-95">
                <FcGoogle
                    size={22}
                    className="bg-red-100 rounded-full"
                />
                Continue With Google
            </button>
        </Fragment>
    );
};

export default OAuth;
