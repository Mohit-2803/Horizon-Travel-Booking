import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrain,
  faCalendarAlt,
  faUser,
  faInfoCircle,
  faReceipt,
  faNewspaper,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { isMobile } from "react-device-detect"; // Importing react-device-detect

const TicketPdf = () => {
  const ticketRef = useRef(null); // Ref for the ticket div
  const location = useLocation();

  const {
    pnr,
    journeyDate,
    totalFare,
    trainId,
    passengerDetails,
    source,
    destination,
    bookingDate, // Include bookingDate here
    compartmentType,
  } = location?.state?.bookingDetails || {};

  console.log("bookingDetails", location?.state?.bookingDetails);

  // Handle print/download functionality
  const handlePrint = () => {
    if (ticketRef.current) {
      const printContents = ticketRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      // Replace body contents with ticket contents
      document.body.innerHTML = printContents;
      window.print();

      // Restore original contents after print
      document.body.innerHTML = originalContents;
      window.location.reload(); // Reload to restore app state
    }
  };

  return (
    <div
      className={`p-6 ${
        isMobile
          ? "bg-white min-h-screen"
          : "bg-gradient-to-b from-gray-100 to-blue-100 min-h-screen"
      } flex flex-col items-center`}
    >
      {/* Ticket Container */}
      <div
        ref={ticketRef}
        className={`w-full ${
          isMobile ? "max-w-md p-4" : "max-w-3xl p-8"
        } bg-white shadow-xl rounded-lg border border-gray-200 relative`}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h1
            className={`${
              isMobile ? "text-2xl" : "text-4xl"
            } font-bold text-blue-700 uppercase`}
          >
            HORIZON
          </h1>
          <p className="text-gray-500">Your Trusted Travel Partner</p>
        </div>

        {/* Important Information */}
        <div
          className={`mb-4 text-sm text-gray-600 ${isMobile ? "text-xs" : ""}`}
        >
          <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
          Please carry a valid ID proof during your journey. Ensure you arrive
          at the station at least 30 minutes before departure.
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Ticket Details */}
        <div className="ticket-details mb-6">
          <div
            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-4`}
          >
            <div
              className={`flex items-center ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              <FontAwesomeIcon
                icon={faNewspaper}
                className="mr-2 text-blue-500"
              />
              <strong>PNR:</strong>{" "}
              <span className="ml-2 text-green-700 font-medium">
                {pnr || "N/A"}
              </span>
            </div>
            <div
              className={`flex items-center ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="mr-2 text-blue-500"
              />
              <strong>Journey Date:</strong>
              <span className="ml-2 text-green-700 font-medium">
                {journeyDate
                  ? new Date(journeyDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
            <div
              className={`flex items-center ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              <FontAwesomeIcon
                icon={faReceipt}
                className="mr-2 text-blue-500"
              />
              <strong>Total Fare:</strong>
              <span className="ml-2 text-green-700 font-medium">
                ₹{totalFare || "N/A"}
              </span>
            </div>
            <div
              className={`flex items-center ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              <FontAwesomeIcon icon={faTrain} className="mr-2 text-blue-500" />
              <strong>Train Number:</strong>
              <span className="ml-2 text-green-700 font-medium">
                {trainId?.trainNumber || "N/A"}
              </span>
            </div>
            <div
              className={`flex items-center ${
                isMobile ? "text-xs" : "text-sm"
              }`}
            >
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="mr-2 text-blue-500"
              />
              <strong>Booking Date:</strong>
              <span className="ml-2 text-green-700 font-medium">
                {bookingDate
                  ? new Date(bookingDate).toLocaleDateString()
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <p
              className={`flex flex-wrap ${
                isMobile ? "text-xs gap-3" : "text-sm gap-5"
              }`}
            >
              <span>
                <span className="font-semibold mr-2">Boarding:</span>
                <span className="text-blue-600 font-medium">
                  {source || "N/A"}
                </span>
              </span>
              <span>
                <span className="font-semibold mr-2">Destination:</span>
                <span className="text-blue-600 font-medium">
                  {destination || "N/A"}
                </span>
              </span>
            </p>
          </div>
        </div>

        <div className="border-t border-gray-300 my-4"></div>

        {/* Passenger Details */}
        <h3 className="text-2xl font-semibold text-blue-600 mb-4 mt-5">
          Passenger Details
        </h3>
        {passengerDetails && passengerDetails.length > 0 ? (
          <ul className="space-y-4">
            {passengerDetails.map((passenger, index) => (
              <li
                key={index}
                className={`p-4 border border-gray-200 rounded-lg ${
                  isMobile ? "text-xs" : "text-sm"
                }`}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="mr-2 text-blue-500"
                    />
                    <strong>Passenger {index + 1}: </strong>
                    <span className="ml-2 text-gray-700 font-semibold capitalize">
                      {passenger.name || "N/A"}
                    </span>
                  </div>
                  <div>
                    <strong>Age:</strong>
                    <span className="ml-2 text-gray-700 font-semibold capitalize">
                      {passenger.age || "N/A"}
                    </span>
                  </div>
                  <div>
                    <strong>Seat Number:</strong>
                    <span className="ml-2 text-gray-700 font-semibold capitalize">
                      {passenger.seatNumber || "N/A"}
                    </span>
                  </div>
                  <div>
                    <strong>Class:</strong>
                    <span className="ml-2 text-gray-700 font-semibold capitalize">
                      {compartmentType || "N/A"}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 text-center">
            No passenger details available.
          </p>
        )}

        {/* IRCTC Authorized Section */}
        <div className="mt-6 p-4 bg-blue-50 border-t border-gray-300 text-center">
          <h3
            className={`${
              isMobile ? "text-lg" : "text-xl"
            } font-semibold text-blue-700`}
          >
            IRCTC Authorized
          </h3>
          <p className={`text-gray-600 ${isMobile ? "text-xs" : "text-sm"}`}>
            This ticket is authorized by the Indian Railways Catering and
            Tourism Corporation (IRCTC). Please carry this ticket and a valid ID
            proof during your journey.
          </p>
        </div>
      </div>

      {/* Print Button */}
      <div className="text-center mt-6">
        <button
          onClick={handlePrint}
          className={`bg-blue-600 text-white py-3 ${
            isMobile ? "px-6" : "px-8"
          } rounded-full shadow-lg hover:bg-blue-700`}
        >
          Print / Download Ticket
        </button>
      </div>
    </div>
  );
};

export default TicketPdf;
