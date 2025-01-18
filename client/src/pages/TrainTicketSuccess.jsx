import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrain, faHome } from "@fortawesome/free-solid-svg-icons";
import { isMobile } from "react-device-detect";
import { ClipLoader } from "react-spinners";

const TrainTicketSuccess = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search); // Extract query parameters
  const sessionId = params.get("sessionId"); // Get sessionId from query params
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for bookingId in the cookies first
    const bookingIdFromCookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("TicketBookedID="));

    if (bookingIdFromCookie) {
      const bookingId = bookingIdFromCookie.split("=")[1];
      fetchBookingDetails(bookingId);
    } else {
      // If no bookingId is in the cookie, wait and poll for it
      const pollBookingDetails = async () => {
        const cookieCheckInterval = setInterval(() => {
          const bookingId = document.cookie
            .split("; ")
            .find((row) => row.startsWith("TicketBookedID="));

          if (bookingId) {
            const actualBookingId = bookingId.split("=")[1];
            clearInterval(cookieCheckInterval); // Stop polling when bookingId is found
            fetchBookingDetails(actualBookingId);
          }
        }, 2000); // Retry every 2 seconds
      };

      pollBookingDetails();
    }

    const fetchBookingDetails = async (bookingId) => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/trains/getBookingById?bookingId=${bookingId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );
        setBookingDetails(response.data.booking);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setError("Failed to fetch booking details. Please try again.");
        setLoading(false);
      }
    };
  }, [sessionId]);

  const handleDownloadClick = () => {
    // Navigate to the TicketPdf page when the button is clicked
    navigate("/ticketpdf", { state: { bookingDetails } });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          <FontAwesomeIcon icon={faHome} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6 space-y-4 text-gray-900 py-1">
      {/* Heading Section */}
      <div className="text-center">
        <h2
          className={`${
            isMobile
              ? "text-2xl font-extrabold text-blue-700 mb-4 animate-bounce"
              : "text-4xl font-extrabold text-blue-700 mb-4 animate-bounce"
          }`}
        >
          <FontAwesomeIcon icon={faTrain} className="mr-3" />
          Booking Successful!
        </h2>
        <p className="text-lg font-medium text-gray-600">
          Your train ticket has been booked successfully. See the details below.
        </p>
      </div>

      {/* Ticket Details Section */}
      <div className="space-y-4">
        <div className="bg-white border-l-4 border-blue-600 p-6 rounded-lg shadow-lg">
          <h3
            className={`${
              isMobile
                ? "text-xl font-bold text-blue-700 mb-4"
                : "text-2xl font-bold text-blue-700 mb-4"
            }`}
          >
            Booking Details
          </h3>
          <div className="text-base text-gray-800 space-y-2">
            <p
              className={`${
                isMobile ? "flex items-center gap-7" : "flex items-center"
              }`}
            >
              <strong className="w-1/3 text-gray-600">PNR:</strong>
              <span className="font-medium">{bookingDetails?.pnr}</span>
            </p>
            <p
              className={`${
                isMobile ? "flex items-center gap-7" : "flex items-center"
              }`}
            >
              <strong className="w-1/3 text-gray-600">Date:</strong>
              <span className="font-medium">
                {new Date(bookingDetails?.journeyDate).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </span>
            </p>
            <p
              className={`${
                isMobile ? "flex items-center gap-7" : "flex items-center"
              }`}
            >
              <strong className="w-1/3 text-gray-600">From:</strong>
              <span className="font-medium">{bookingDetails?.source}</span>
            </p>
            <p
              className={`${
                isMobile ? "flex items-center gap-7" : "flex items-center"
              }`}
            >
              <strong className="w-1/3 text-gray-600">To:</strong>
              <span className="font-medium">{bookingDetails?.destination}</span>
            </p>
            <p
              className={`${
                isMobile ? "flex items-center gap-7" : "flex items-center"
              }`}
            >
              <strong className="w-1/3 text-gray-600">Total Seats:</strong>
              <span className="font-medium">{bookingDetails?.totalSeats}</span>
            </p>
          </div>
        </div>

        {/* IRCTC Authorized Info */}
        <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
          <p
            className={`${
              isMobile
                ? "text-center text-base font-semibold text-gray-700"
                : "text-center text-lg font-semibold text-gray-700"
            }`}
          >
            This booking is authorized by IRCTC
          </p>
        </div>

        {/* Ads Section */}
        <div className="bg-blue-100 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-700">
            Exclusive Offers
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            <strong>Get 20% off on your next journey!</strong> Use promo code:{" "}
            <span className="font-bold text-blue-500">TRAIN20</span>
          </p>
        </div>
      </div>

      {/* Download Button Section */}
      <div className="text-center mb-8">
        <button
          onClick={handleDownloadClick}
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faTrain} className="mr-2" />
          Download Ticket
        </button>
      </div>

      {/* Footer Section */}
      <div className="text-center">
        <Link
          to="/"
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 mb-8 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105"
        >
          <FontAwesomeIcon icon={faHome} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default TrainTicketSuccess;
