import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicketAlt,
  faWheelchair,
  faUtensils,
  faConciergeBell,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { isMobile } from "react-device-detect"; // Import isMobile from react-device-detect

const AdsInfo = () => {
  return (
    <div
      className={`mt-12 px-4 sm:px-8 py-6 space-y-6 ${isMobile ? "px-4" : ""}`}
    >
      {/* Ad Section */}
      <div
        className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 sm:p-10 rounded-lg shadow-lg text-center`}
      >
        <h3
          className={`${
            isMobile
              ? "text-base sm:text-2xl font-bold mb-4"
              : "text-xl sm:text-2xl font-bold mb-4"
          }`}
        >
          <FontAwesomeIcon
            icon={faTicketAlt}
            className={`${isMobile ? "mr-3" : "mr-3"}`}
          />
          Exciting Offers on Train Tickets!
        </h3>
        <p className="text-base sm:text-lg font-medium">
          Book now and get up to <span className="font-bold">50% off</span> on
          selected routes. Limited time offer!
        </p>
      </div>

      {/* Special Services Section */}
      <div
        className={`bg-gradient-to-r from-green-100 to-green-100 text-neutral-700 p-6 sm:p-10 rounded-lg shadow-lg`}
      >
        <h3 className="text-xl sm:text-2xl font-bold mb-5">
          <FontAwesomeIcon icon={faConciergeBell} className="mr-3" />
          Special Services
        </h3>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 ${
            isMobile ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          <div className="p-6 bg-green-500 rounded-lg shadow-md text-center">
            <FontAwesomeIcon
              icon={faWheelchair}
              className="text-white text-3xl mb-4"
            />
            <h4 className="text-lg font-semibold text-white">
              Wheelchair Assistance
            </h4>
            <p className="mt-3 text-white">
              Request assistance at the time of booking.
            </p>
          </div>
          <div className="p-6 bg-green-500 rounded-lg shadow-md text-center">
            <FontAwesomeIcon
              icon={faUtensils}
              className="text-white text-3xl mb-4"
            />
            <h4 className="text-lg font-semibold text-white">On-Board Meals</h4>
            <p className="mt-3 text-white">
              Enjoy fresh, hygienic meals during your journey.
            </p>
          </div>
          <div className="p-6 bg-green-500 rounded-lg shadow-md text-center">
            <FontAwesomeIcon
              icon={faConciergeBell}
              className="text-white text-3xl mb-4"
            />
            <h4 className="text-lg font-semibold text-white">Lounge Access</h4>
            <p className="mt-3 text-white">
              Relax in premium lounges at select stations.
            </p>
          </div>
          <div className="p-6 bg-green-500 rounded-lg shadow-md text-center">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-white text-3xl mb-4"
            />
            <h4 className="text-lg font-semibold text-white">24/7 Support</h4>
            <p className="mt-3 text-white">
              Contact us anytime for travel assistance.
            </p>
          </div>
        </div>
      </div>

      <div
        className={`${
          isMobile
            ? "hidden"
            : "bg-white p-8 rounded-lg shadow-lg border border-gray-200"
        }`}
      >
        <h3 className="text-xl font-bold text-blue-600 flex items-center mb-5">
          <FontAwesomeIcon
            icon={faInfoCircle}
            className="mr-3 text-blue-500 text-2xl"
          />
          Train Travel Tips
        </h3>
        <ul className="space-y-3">
          {[
            "Carry valid ID proof",
            "Check schedules regularly",
            "Pre-book meals",
            "Travel light",
            "Go green with e-tickets",
          ].map((tip, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-5 h-5 flex items-center justify-center bg-gray-600 text-white rounded-full font-bold text-xs">
                {index + 1}
              </span>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">{tip}:</span> Ensure you have
                government-issued ID while traveling.
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Additional Information */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-blue-500">
            Why Book with Us?
          </h3>
          <p className="text-gray-600">
            Enjoy seamless booking with exclusive offers and trusted services.
            Your convenience is our priority.
          </p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-green-500">
            Safe Travel Guarantee
          </h3>
          <p className="text-gray-600">
            We ensure all journeys are safe and comfortable, partnering with top
            operators.
          </p>
        </div>
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-red-500">
            24/7 Support
          </h3>
          <p className="text-gray-600">
            Get assistance anytime with our dedicated support team, available
            around the clock.
          </p>
        </div>
      </div>

      {/* About Us Section */}
      <div
        className={`${
          isMobile ? "hidden" : "bg-gray-100 p-8 rounded-lg shadow-md"
        }`}
      >
        <h3 className="text-xl font-bold text-gray-700 mb-4">
          <FontAwesomeIcon icon={faInfoCircle} className="mr-3" />
          About Us
        </h3>
        <p className="text-gray-600">
          We are a trusted platform offering seamless train ticket booking
          services. Our goal is to ensure a safe, convenient, and enjoyable
          journey for every traveler. With exclusive offers and top-notch
          customer support, booking with us is always a pleasure.
        </p>
      </div>
    </div>
  );
};

export default AdsInfo;
