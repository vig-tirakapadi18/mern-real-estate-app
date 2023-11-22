import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Header from "./components/Header";
import SignUp from "./pages/SignUp";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./components/CreateListing";
import UpdateListing from "./components/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";

const App = () => {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/about"
                    element={<About />}
                />
                <Route
                    path="/search"
                    element={<Search />}
                />
                <Route
                    path="/listing/:listingId"
                    element={<Listing />}
                />

                <Route element={<PrivateRoute />}>
                    <Route
                        path="/profile"
                        element={<Profile />}
                    />
                    <Route
                        path="/create-listing"
                        element={<CreateListing />}
                    />
                    <Route
                        path="/update-listing/:listingId"
                        element={<UpdateListing />}
                    />
                </Route>
                <Route
                    path="/sign-in"
                    element={<SignIn />}
                />
                <Route
                    path="/sign-up"
                    element={<SignUp />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
