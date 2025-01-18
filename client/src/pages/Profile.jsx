import { useState, useEffect } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faTrain } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowLeft, FaTicketAlt, FaMapMarkerAlt } from "react-icons/fa";
import { isMobile } from "react-device-detect";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState(null); // State for storing bookings
  const [selectedBooking, setSelectedBooking] = useState(null); // State to store the clicked booking
  const [showBookings, setShowBookings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userId && token) {
      axios
        .get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/getUserById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        )
        .then((response) => {
          setUserDetails(response.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.response.data.message === "Invalid or expired token") {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/login");
          }
          setLoading(false);
        });
    } else {
      console.error("User ID or token missing from localStorage");
      navigate("/login");
      setLoading(false);
    }
  }, [navigate]);

  const handleShowBookings = () => {
    const userId = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (userId && token) {
      axios
        .get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/auth/getUserBookingById/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        )
        .then((response) => {
          console.log(response);
          setBookings(response.data.bookings);
          setShowBookings(true);
        })
        .catch((error) => {
          if (error.response.data.message == "No bookings found") {
            toast.info("No bookings found");
          }
          console.error("Error fetching bookings:", error);
        });
    }
  };

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking); // Set the clicked booking
  };

  const handleBack = () => {
    setSelectedBooking(null); // Clear selected booking to show all bookings
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#4A90E2" size={50} loading={loading} />
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center p-8 ${
        isMobile
          ? "bg-gradient-to-r from-indigo-500 to-purple-600 px-2 py-8"
          : "bg-gradient-to-r from-blue-600 to-blue-300"
      } `}
    >
      <ToastContainer />
      <h1
        className={`text-4xl font-extrabold mb-8 text-white ${
          isMobile ? "text-3xl" : ""
        }`}
      >
        My Profile
      </h1>
      {!showBookings ? (
        <div
          className={`bg-white shadow-xl rounded-lg p-8 w-full ${
            isMobile ? "max-w-xs shadow-lg" : "max-w-lg"
          }`}
        >
          <div className="space-y-6">
            {/* Name Section */}
            <div>
              <label className="text-gray-800 font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faUser} className="text-gray-600" />{" "}
                Name:
              </label>
              <input
                type="text"
                value={userDetails?.name || ""}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
              />
            </div>

            {/* Email Section */}
            <div>
              <label className="text-gray-800 font-medium flex items-center gap-2">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-600" />{" "}
                Email:
              </label>
              <input
                type="email"
                value={userDetails?.email || ""}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
              />
            </div>

            {/* Button Section */}
            <button
              onClick={handleShowBookings}
              className="mt-6 bg-orange-600 text-white py-3 px-6 rounded-md hover:bg-orange-700 transition ease-in-out duration-200 flex items-center gap-2"
            >
              <FontAwesomeIcon icon={faTrain} />
              View My Bookings
            </button>
          </div>
        </div>
      ) : selectedBooking ? (
        // Expanded view for selected booking
        <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-3xl mx-auto transform hover:shadow-3xl transition-all duration-300">
          <h2
            className={`${
              isMobile
                ? "text-2xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-4 uppercase tracking-wide"
                : "text-4xl font-bold mb-6 text-gray-800 text-center border-b-4 border-blue-500 pb-4 uppercase tracking-wide"
            }`}
          >
            Booking Details
          </h2>
          <div className="mt-6 text-gray-700 space-y-4">
            <p className="flex items-center">
              <FaTicketAlt className="mr-3 text-blue-600 text-xl" />
              <strong className="w-auto mr-2">PNR:</strong>{" "}
              {selectedBooking.pnr}
            </p>
            <p className="flex items-center">
              <FaMapMarkerAlt className="mr-3 text-red-500 text-xl" />
              <strong className="w-auto mr-2">Source:</strong>{" "}
              {selectedBooking.source}
            </p>
            <p className="flex items-center">
              <FaMapMarkerAlt className="mr-3 text-green-500 text-xl" />
              <strong className="w-auto mr-2">Destination:</strong>{" "}
              {selectedBooking.destination}
            </p>

            <hr className="border-3" />

            <p className="flex items-center">
              <strong className="mr-3 w-auto">Journey Date:</strong>{" "}
              {new Date(selectedBooking.journeyDate).toLocaleString()}
            </p>
            <p className="flex items-center">
              <strong className="mr-3 w-auto">Booking Date:</strong>{" "}
              {new Date(selectedBooking.bookingDate).toLocaleString()}
            </p>
            <p className="flex items-center">
              <strong className="mr-3 w-auto">Class:</strong>{" "}
              {selectedBooking.compartmentType}
            </p>
            <p className="flex items-center">
              <strong className="mr-3 w-auto">Seats:</strong>{" "}
              {selectedBooking.seatNumbers.join(", ")}
            </p>
            <p className="text-lg font-semibold flex items-center">
              <strong className="mr-3 w-auto">Total Fare:</strong> ₹
              {selectedBooking.totalFare}
            </p>
          </div>

          {/* Passenger Details */}
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2">
              Passenger Details
            </h3>
            <ul className="space-y-3">
              {selectedBooking.passengerDetails.map((passenger, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-md shadow-sm border border-gray-200"
                >
                  <div className="text-gray-700">
                    <p className="text-lg font-medium">
                      {index + 1}. {passenger.name}
                    </p>
                    <p className="text-sm">
                      <strong>Age:</strong> {passenger.age} |{" "}
                      <strong>Gender:</strong> {passenger.gender}
                    </p>
                  </div>
                  <div className="text-gray-500">
                    <strong>Seat:</strong> {passenger.seatNumber}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleBack}
            className="mt-10 bg-gradient-to-r from-red-500 to-red-700 text-white py-3 px-6 rounded-lg hover:from-red-600 hover:to-red-800 transition-transform transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            <FaArrowLeft className="inline mr-2 text-lg" />
            Back to Bookings
          </button>
        </div>
      ) : (
        // List of bookings
        <div className="bg-white shadow-xl rounded-lg p-8 w-full max-w-2xl">
          {bookings && bookings.length > 0 ? (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-lg shadow-md border border-gray-300 hover:shadow-xl transition-transform transform hover:scale-105 cursor-pointer"
                  onClick={() => handleSelectBooking(booking)}
                >
                  <div className="flex justify-between items-center">
                    <p
                      className={`${
                        isMobile
                          ? "hidden"
                          : "text-lg font-semibold text-gray-800 flex justify-center items-center"
                      }`}
                    >
                      <FaTicketAlt className="inline mr-2 text-blue-600" />
                      PNR: {booking.pnr}
                    </p>
                    <p
                      className={`${
                        isMobile
                          ? "text-gray-600 flex justify-center items-center"
                          : "text-gray-600 flex justify-center items-center"
                      }`}
                    >
                      <FaMapMarkerAlt className="mr-1 text-green-500" />
                      {booking.source} ➝ {booking.destination}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">No bookings found.</p>
          )}
          <button
            onClick={() => setShowBookings(false)}
            className="mt-6 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 transition ease-in-out duration-200 transform hover:scale-105"
          >
            <FaArrowLeft className="inline mr-2" />
            Back to Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
