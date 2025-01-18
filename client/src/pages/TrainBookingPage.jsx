/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrain,
  faUserPlus,
  faTrash,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { isMobile } from "react-device-detect"; // Importing isMobile

const TrainBookingPage = () => {
  const { state } = useLocation();
  const { trainDetails, compartmentDetails, journeyDate } = state;
  const [passengers, setPassengers] = useState([]);
  const navigate = useNavigate();

  const [currentPassenger, setCurrentPassenger] = useState({
    name: "",
    age: "",
    gender: "",
  });

  // Function to check token validity
  const checkToken = async () => {
    const token = localStorage.getItem("token");
    const bookedTicket = localStorage.getItem("bookedTicket");

    if (!token) {
      // Redirect to login if no token
      navigate("/login");
      return;
    } else if (bookedTicket) {
      navigate("/"); // Redirect to home page if the token exists
    }
  };

  useEffect(() => {
    checkToken();
  }, [checkToken]);

  const addPassenger = () => {
    if (passengers.length > 3) {
      toast.error("Maximum 4 passengers allowed");
      return;
    }
    if (
      !currentPassenger.name ||
      !currentPassenger.age ||
      !currentPassenger.gender
    ) {
      toast.error("Please fill out all passenger details!");
      return;
    } else if (currentPassenger.age < 0 || currentPassenger.age > 150) {
      toast.error("Invalid Age");
      return;
    }

    setPassengers([...passengers, currentPassenger]);
    setCurrentPassenger({ name: "", age: "", gender: "" }); // Reset form
    toast.success("Passenger added!");
  };

  const removePassenger = (index) => {
    const updatedPassengers = passengers.filter((_, i) => i !== index);
    setPassengers(updatedPassengers);
    toast.info("Passenger removed!");
  };

  const updateCurrentPassenger = (field, value) => {
    setCurrentPassenger((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (passengers.length === 0) {
      toast.error("Please add at least one passenger!");
      return false;
    }
    return true;
  };

  const price = {
    base: compartmentDetails.price * passengers.length,
    gst: (compartmentDetails.price * passengers.length * 0.18).toFixed(2),
    total: (compartmentDetails.price * passengers.length * 1.18).toFixed(2),
  };

  const handleBooking = () => {
    if (!validateForm()) return;

    const userId = localStorage.getItem("user");
    if (!userId) {
      toast.error("User not logged in. Please log in first.");
      navigate("/login");
      return;
    }

    const bookingData = {
      userId: userId, // Use userId from localStorage
      compartmentType: compartmentDetails.type,
      passengerDetails: passengers,
      journeyDate: journeyDate,
      price: price,
      trainDetails: trainDetails,
    };

    // Navigate to the payment page with payment data
    navigate("/payment", { state: bookingData });
  };

  return (
    <div
      className={`${
        isMobile
          ? "bg-gray-50 space-y-3 px-3 py-3"
          : "bg-gray-100 space-y-6 p-6"
      } min-h-screen m-auto max-w-4xl`}
    >
      <ToastContainer />

      {/* Train Details Block */}
      <div className="p-6 bg-white shadow-md rounded-lg border border-gray-200">
        <div className="flex items-center mb-6 text-start gap-3">
          <FontAwesomeIcon icon={faTrain} className="text-blue-600 text-2xl" />
          <h3
            className={`text-2xl font-semibold text-gray-900 ${
              isMobile ? "text-base" : "text-2xl"
            }`}
          >
            {trainDetails.trainName}
          </h3>
          <span
            className={`${
              isMobile ? "text-xs" : "text-sm"
            } font-medium bg-blue-100 text-blue-600 px-3 py-1 rounded-full`}
          >
            #{trainDetails.trainNumber}
          </span>
        </div>
        <div className="flex gap-4 items-center border-t pt-3 border-gray-400 text-start">
          <div className="flex items-center gap-2">
            <span
              className={`${
                isMobile
                  ? "text-base font-semibold text-gray-600"
                  : "text-lg font-semibold text-gray-600"
              }`}
            >
              {compartmentDetails.type}
            </span>
          </div>
          <div className="flex items-center rounded-full bg-green-100 p-2 px-4">
            <div className="flex items-center gap-2">
              <span
                className={`${
                  isMobile
                    ? "text-sm font-semibold text-green-600"
                    : "text-base font-semibold text-green-600"
                }`}
              >
                Available Seats
              </span>
              <span
                className={`${
                  isMobile
                    ? "text-sm font-semibold text-green-600"
                    : "text-lg font-semibold text-green-600"
                }`}
              >
                {compartmentDetails.availableSeats}
              </span>
            </div>
          </div>
        </div>
        <p
          className={`mt-2 text-sm text-gray-500 font-medium ${
            isMobile ? "text-xs" : "text-sm"
          }`}
        >
          Quota: <span className="text-blue-500 font-semibold">General</span> |
          Date:{" "}
          <span className="text-blue-500 font-semibold">
            {new Date(journeyDate).toDateString()}
          </span>
        </p>
        <div className="mt-6 h-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
      </div>

      {/* Journey Details Block */}
      <div className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 shadow-xl rounded-xl">
        <div className="flex justify-between items-center gap-4">
          {/* Left Section */}
          <div>
            <p className="text-lg font-semibold text-blue-600">
              {trainDetails.source}
            </p>
            <p
              className={`${
                isMobile
                  ? "text-gray-500 mt-1 font-medium"
                  : "text-gray-500 mt-1 font-medium"
              }`}
            >
              {new Date(trainDetails.adjustedDepartureTime).toLocaleString()}
            </p>
          </div>
          {/* Right Section */}
          <div className="text-right">
            <p className="text-lg font-semibold text-blue-600">
              {trainDetails.destination}
            </p>
            <p className="text-gray-500 mt-1 font-medium">
              {new Date(trainDetails.arrivalTimeAtDestination).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="my-6 border-t-2 border-dashed border-blue-300"></div>
        <p
          className={`${
            isMobile
              ? "text-gray-700 mt-3 text-sm font-medium"
              : "text-gray-700 mt-3 text-base font-medium"
          }`}
        >
          <span className="inline-block px-2 py-1 bg-blue-200 text-blue-900 rounded-md">
            Distance: {trainDetails.totalDistance} KM
          </span>
        </p>
      </div>

      {/* Passenger Details Block */}
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <h3
          className={`${
            isMobile
              ? "text-base font-bold text-gray-800 mb-4"
              : "text-xl font-bold text-gray-800 mb-4"
          }`}
        >
          <FontAwesomeIcon icon={faUserPlus} className="text-blue-600 mr-2" />
          Add Passenger
        </h3>
        <div className="mb-4 border p-4 rounded-lg bg-gray-50 shadow">
          <input
            type="text"
            placeholder="Name"
            value={currentPassenger.name}
            onChange={(e) => updateCurrentPassenger("name", e.target.value)}
            className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg outline-1 outline-orange-300"
          />
          <input
            type="number"
            placeholder="Age"
            value={currentPassenger.age}
            onChange={(e) => updateCurrentPassenger("age", e.target.value)}
            className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg outline-orange-300"
          />
          <select
            value={currentPassenger.gender}
            onChange={(e) => updateCurrentPassenger("gender", e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-orange-300"
          >
            <option value="" disabled>
              Gender
            </option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <button
            onClick={addPassenger}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
            Add Passenger
          </button>
        </div>
        <div>
          <h3
            className={`${
              isMobile
                ? "text-base font-bold text-gray-700 mb-4"
                : "text-lg font-bold text-gray-700 mb-4"
            }`}
          >
            Passenger List
          </h3>
          <ul className="space-y-4">
            {passengers.map((passenger, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow"
              >
                <span className={`${isMobile ? "text-sm font-medium" : ""}`}>
                  {passenger.name} ({passenger.age}, {passenger.gender})
                </span>
                <button
                  onClick={() => removePassenger(index)}
                  className={`${
                    isMobile
                      ? "px-3 py-2 bg-red-600 text-white rounded-lg"
                      : "px-4 py-2 bg-red-600 text-white rounded-lg"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={faTrash}
                    className={`${isMobile ? "mr-0" : "mr-2"}`}
                  />
                  {!isMobile && "Remove"}{" "}
                  {/* Only show 'Remove' text if it's not mobile */}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Price Details Block */}
      <div className="p-6 bg-gradient-to-br from-white to-gray-100 shadow-xl rounded-lg border border-gray-200">
        <h4
          className={`${
            isMobile
              ? "text-lg font-bold text-gray-800 mb-4 flex items-center"
              : "text-xl font-extrabold text-gray-800 mb-4 flex items-center"
          }`}
        >
          Total Price
        </h4>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p
              className={`${
                isMobile
                  ? "text-gray-600 font-medium"
                  : "text-gray-600 font-medium"
              }`}
            >
              Base Price:
            </p>
            <p className="text-gray-800 font-semibold">₹{price.base}</p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 font-medium">GST (18%):</p>
            <p className="text-gray-800 font-semibold">₹{price.gst}</p>
          </div>
          <div className="border-t-2 border-dashed pt-4">
            <div className="flex justify-between items-center">
              <p
                className={`${
                  isMobile
                    ? "text-base font-bold text-gray-700"
                    : "text-lg font-bold text-gray-700"
                }`}
              >
                Grand Total:
              </p>
              <p
                className={`${
                  isMobile
                    ? "text-base font-bold text-green-600"
                    : "text-lg font-extrabold text-green-600"
                }`}
              >
                ₹{price.total}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleBooking}
          className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold text-lg shadow-md hover:shadow-lg transition duration-300 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={faCheckCircle} className="mr-3" />
          Book
        </button>
      </div>
    </div>
  );
};

export default TrainBookingPage;
