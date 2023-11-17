import loader from "../../assets/pulse.svg";

const PulseLoading = () => {
    return (
        <div>
            <img
                src={loader}
                alt="loading"
                className="w-10 mx-auto"
            />
        </div>
    );
};

export default PulseLoading;
