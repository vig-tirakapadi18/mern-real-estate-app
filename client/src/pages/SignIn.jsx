import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loader from "../assets/pulse.svg";
import {
    signInFailure,
    signInStart,
    signInSuccess,
} from "../store/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

const SignIn = () => {
    const [formData, setFormData] = useState({});

    const { error, loading } = useSelector((state) => state.user);
    console.log(error, loading);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeHandler = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            dispatch(signInStart());
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success === false) {
                dispatch(signInFailure(data.message));
                return;
            }

            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            dispatch(signInFailure(error.message));
        }
    };

    return (
        <Fragment>
            <h1 className="text-center text-3xl font-semibold my-7">Sign In</h1>
            <form
                onSubmit={submitHandler}
                className="flex justify-center flex-col max-w-lg align-middle mx-auto gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="p-3 rounded-lg border outline-none bg-stone-100 text-xl"
                    id="email"
                    onChange={changeHandler}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-3 rounded-lg border outline-none bg-stone-100 text-xl"
                    id="password"
                    onChange={changeHandler}
                />
                <button
                    disabled={loading}
                    className="bg-stone-700 uppercase text-white p-3 rounded-lg text-lg hover:opacity-95 disabled:p-0.5 disabled:cursor-not-allowed disabled:opacity-90">
                    {loading ? (
                        <div>
                            <img
                                src={loader}
                                className="mx-auto w-[50px]"
                            />
                        </div>
                    ) : (
                        "Sign In"
                    )}
                </button>

                <div className="flex gap-2 my-2 text-center text-lg">
                    <p className="text-stone-900">
                        Don&apos;t have an account?
                    </p>
                    <Link to={"/sign-up"}>
                        <span className="text-blue-700">Sign Up</span>
                    </Link>
                </div>
                {error ? (
                    <p className="text-rose-800 text-lg">{error.message}</p>
                ) : (
                    ""
                )}
            </form>
        </Fragment>
    );
};

export default SignIn;
