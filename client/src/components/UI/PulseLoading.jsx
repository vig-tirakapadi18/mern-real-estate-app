/* eslint-disable react/prop-types */
import loader from "../../assets/pulse.svg";

const PulseLoading = (props) => {
    return (
        <div>
            <img
                src={loader}
                alt="loading"
                className={`${props.width || "w-10"} mx-auto`}
            />
        </div>
    );
};

export default PulseLoading;
