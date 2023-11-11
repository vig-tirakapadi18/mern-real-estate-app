import { Fragment } from "react";
import { Link } from "react-router-dom";

const SignIn = () => {
    return (
        <Fragment>
            <h1 className="text-center text-3xl font-semibold my-7">Sign In</h1>
            <form className="flex justify-center flex-col max-w-lg align-middle mx-auto gap-4">
                <input
                    type="text"
                    placeholder="Username"
                    className="p-3 rounded-lg border outline-none bg-stone-100 text-xl"
                    id="username"
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="p-3 rounded-lg border outline-none bg-stone-100 text-xl"
                    id="email"
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-3 rounded-lg border outline-none bg-stone-100 text-xl"
                    id="password"
                />
                <button className="bg-stone-700 uppercase text-white p-3 rounded-lg text-lg hover:opacity-95 disabled:opacity-80">
                    Sign In
                </button>

                <div className="flex gap-2 my-2 text-center text-lg">
                    <p className="text-stone-900">Have an account?</p>
                    <Link to={"/sign-in"}>
                        <span className="text-blue-700">Sign In</span>
                    </Link>
                </div>
            </form>
        </Fragment>
    );
};

export default SignIn;
