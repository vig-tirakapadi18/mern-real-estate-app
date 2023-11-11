import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import loader from "../assets/pulse.svg";

const SignUp = () => {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const changeHandler = (event) => {
        setFormData({ ...formData, [event.target.id]: event.target.value });
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        try {
            setLoading(true);
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success === false) {
                setError(data.message);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            navigate("/sign-in");
        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
    };

    return (
        <Fragment>
            <h1 className="text-center text-3xl font-semibold my-7">Sign Up</h1>
            <form
                onSubmit={submitHandler}
                className="flex justify-center flex-col max-w-lg align-middle mx-auto gap-4">
                <input
                    type="text"
                    placeholder="Username"
                    className="p-3 rounded-lg border outline-none bg-stone-100 text-xl"
                    id="username"
                    onChange={changeHandler}
                />
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
                        <div className="">
                            <img
                                src={loader}
                                className="mx-auto w-[50px]"
                            />
                        </div>
                    ) : (
                        "Sign Up"
                    )}
                </button>

                <div className="flex gap-2 my-2 text-center text-lg">
                    <p className="text-stone-900">Have an account?</p>
                    <Link to={"/sign-up"}>
                        <span className="text-blue-700">Sign In</span>
                    </Link>
                </div>
                {error ? <p className="text-rose-800 text-lg">{error}</p> : ""}
            </form>
        </Fragment>
    );
};

export default SignUp;
