/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { isMobile } from "react-device-detect"; // Import isMobile from react-device-detect

const AvailableTrains = ({ searchParams }) => {
  const [trainList, setTrainList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [activeDate, setActiveDate] = useState(
    new Date(searchParams.startDate)
  );

  const handleCompartmentClick = (train, compartment) => {
    if (compartment.availableSeats > 0) {
      navigate("/trainBooking", {
        state: {
          trainDetails: {
            trainNumber: train.trainNumber,
            trainName: train.trainName,
            source: searchParams.fromCity,
            destination: searchParams.toCity,
            adjustedDepartureTime: train.adjustedDepartureTime,
            arrivalTimeAtDestination: train.arrivalTimeAtDestination,
            totalDistance: train.totalDistance,
          },
          compartmentDetails: {
            availableSeats: compartment.availableSeats,
            type: compartment.compartmentType,
            price: calculatePrice(
              compartment.compartmentType,
              train.totalDistance
            ),
          },
          journeyDate: activeDate,
        },
      });
    }
  };

  // Function to calculate price based on distance and compartment type
  const calculatePrice = (compartmentType, distance) => {
    let basePrice = 0;

    // Example logic: Define prices based on compartment type
    switch (compartmentType) {
      case "Sleeper":
        basePrice = 100; // Example base price for Sleeper
        break;
      case "2AC":
        basePrice = 1050; // Example base price for 2 AC
        break;
      case "3AC":
        basePrice = 550; // Example base price for third AC Class
        break;
      case "1AC":
        basePrice = 1580; // Example base price for First ac Class
        break;
      case "General":
        basePrice = 30; // Example base price for GN Class
        break;
    }

    // Price adjustment based on distance (for example, ₹5 per km)
    const price = basePrice + distance * 1;

    return price;
  };

  // Function to fetch trains based on date, source, and destination
  const fetchTrains = (date) => {
    const token = localStorage.getItem("token");
    setLoading(true);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/trains/searchTrains`, {
        params: {
          source: searchParams.fromCity,
          destination: searchParams.toCity,
          date: new Date(date).toISOString().split("T")[0],
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
      })
      .then((response) => {
        if (response.data.trains.length === 0) {
          toast.info("No trains available for this route and date.");
          setTrainList([]); // Reset the train list if no trains are found
        } else {
          setTrainList(response.data.trains);
        }
      })
      .catch((error) => {
        console.log(error.response.data.message);

        if (error.response.data.message == "Invalid or expired token") {
          // Remove specific items
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
        }

        if (
          error.response.data.message ==
          "No valid route between the source and destination."
        ) {
          toast.error("Not Available");
        }

        setTrainList([]); // Ensure the list is cleared on error
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Generate dates for tabs, ensuring that today's date is in the middle and no past dates are shown
  const generateDateTabs = () => {
    const dates = [];
    const startDate = new Date(searchParams.startDate);
    const today = new Date();

    // Ensure the start date is not in the past, start from today if necessary
    const firstDate = today > startDate ? today : startDate;

    // Generate 5 consecutive dates around today
    for (let i = -2; i <= 2; i++) {
      const date = new Date(firstDate);
      date.setDate(firstDate.getDate() + i);

      // If the generated date is in the past, skip it
      if (date < today) continue;

      dates.push(date);
    }

    // If there are fewer than 5 dates, add more future dates to ensure there are 5
    while (dates.length < 5) {
      const nextDate = new Date(dates[dates.length - 1]);
      nextDate.setDate(nextDate.getDate() + 1);
      dates.push(nextDate);
    }

    return dates;
  };

  // Fetch trains on initial load and date change
  useEffect(() => {
    setTrainList([]); // Clear the current train list before fetching new data

    fetchTrains(activeDate);
  }, [activeDate]);

  const handleDateChange = (date) => {
    setActiveDate(date); // Set the active date and trigger useEffect
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Date Tabs */}
      <div
        className={`flex ${
          isMobile
            ? "overflow-x-scroll gap-2 mb-5 py-1"
            : "justify-center gap-4 mb-5"
        }`}
      >
        {generateDateTabs().map((date, index) => (
          <div
            key={index}
            onClick={() => handleDateChange(date)}
            className={`${
              isMobile
                ? "cursor-pointer px-3 py-1 rounded-lg transition-all duration-300 ease-in-out transform"
                : "cursor-pointer px-6 py-1 rounded-lg transition-all duration-300 ease-in-out transform"
            } ${
              activeDate.toDateString() === date.toDateString()
                ? "bg-blue-700 text-white font-bold shadow-lg scale-105"
                : "bg-blue-500 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-md"
            }`}
          >
            <p
              className={`${
                isMobile
                  ? "flex flex-row gap-1 items-center text-xs font-semibold"
                  : "flex flex-row gap-1 text-lg font-semibold"
              }`}
            >
              <span>{date.getDate()}</span>
              <span>{date.toLocaleString("en-US", { month: "short" })}</span>
            </p>

            <p className={`${isMobile ? "text-xs" : "text-sm"}`}>
              {date.toLocaleString("en-US", { weekday: "short" })}
            </p>
          </div>
        ))}
      </div>

      {/* Route Details */}
      <div
        className={`${
          isMobile ? "text-center" : "text-center mx-48"
        } bg-gradient-to-r from-blue-400 to-blue-400 shadow-lg rounded-lg p-4 mb-6`}
      >
        <h3
          className={`${
            isMobile
              ? "text-lg font-semibold text-white mb-2"
              : "text-2xl font-semibold text-black mb-2"
          }`}
        >
          {searchParams.fromCity} → {searchParams.toCity}
        </h3>
        <p
          className={`${
            isMobile
              ? "text-sm font-semibold text-white mb-2"
              : "text-lg font-semibold text-[black] mb-2"
          }`}
        >
          Departure Date:{" "}
          <span className="text-white">
            {new Date(activeDate).toLocaleDateString("en-US", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}
          </span>
        </p>
        <div className="border-t-2 border-gray-100 pt-3 mt-3">
          <p
            className={`${
              isMobile
                ? "text-xs font-medium text-gray-900"
                : "text-base font-medium text-gray-900"
            }`}
          >
            Find the best trains for your journey.
          </p>
        </div>
      </div>

      {loading && (
        <>
          {/* Train List Skeleton Loader */}
          <div className="grid grid-cols-1 gap-6">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className={`${
                  isMobile ? "px-4" : "mx-48"
                } bg-gray-100 animate-pulse shadow-lg rounded-lg p-4 border-t-4 border-blue-500 ${
                  isMobile ? "px-2" : "px-10"
                }`}
              >
                {/* Train Details Skeleton */}
                <div className="flex justify-between items-center mb-3">
                  {/* Train Name and Number Skeleton */}
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-4 bg-gray-300 rounded-md"></div>
                    <div className="w-10 h-4 bg-gray-300 rounded-full"></div>
                  </div>

                  {/* Operating Days Skeleton */}
                  <div className="w-24 h-4 bg-gray-300 rounded-full"></div>
                </div>

                {/* Time Details Skeleton */}
                <div className="flex justify-between items-center mb-3">
                  {/* Departure Details Skeleton */}
                  <div className="flex flex-col w-1/2">
                    <div className="flex items-center">
                      <div className="w-14 h-5 bg-gray-300 rounded-md mr-2"></div>
                      <div className="w-14 h-5 bg-gray-300 rounded-md"></div>
                    </div>
                    <div className="w-16 h-3 bg-gray-300 rounded-md mt-1"></div>
                  </div>

                  <div className="w-16 h-3 bg-gray-300 rounded-md py-2 px-3 border-b border-gray-300"></div>

                  {/* Arrival Details Skeleton */}
                  <div className="flex flex-col items-end w-1/2">
                    <div className="flex items-center">
                      <div className="w-14 h-5 bg-gray-300 rounded-md mr-2"></div>
                      <div className="w-14 h-5 bg-gray-300 rounded-md"></div>
                    </div>
                    <div className="w-16 h-3 bg-gray-300 rounded-md mt-1"></div>
                  </div>
                </div>

                {/* Compartment Details Skeleton */}
                <div
                  className={`flex ${
                    isMobile ? "overflow-x-auto gap-3" : "flex-wrap gap-3"
                  }`}
                >
                  {[...Array(3)].map((_, idx) => (
                    <div
                      key={idx}
                      className={`bg-gray-200 p-2 rounded-lg text-center cursor-wait ${
                        isMobile ? "min-w-32" : "w-36"
                      }`}
                    >
                      <div className="w-20 h-3 bg-gray-300 rounded-md mb-1"></div>
                      <div className="w-28 h-4 bg-gray-300 rounded-md mb-1"></div>
                      <div className="w-12 h-3 bg-gray-300 rounded-md mb-1"></div>
                      <div className="w-20 h-3 bg-gray-300 rounded-md mb-1"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Train List */}
      <div className="grid grid-cols-1 gap-6">
        {trainList.length > 0 &&
          trainList.map((train) => (
            <div
              key={train.trainNumber}
              className={`${
                isMobile ? "px-4" : "mx-48"
              } bg-white shadow-xl rounded-lg p-4 border-t-4 border-blue-500 ${
                isMobile ? "px-2" : "px-10"
              }`}
            >
              {/* Train Details */}
              <div className="flex justify-between items-center mb-4">
                {/* Train Name and Number */}
                <div className="flex items-center space-x-3">
                  <h3
                    className={`${
                      isMobile
                        ? "text-base font-medium text-gray-700"
                        : "text-lg lg:text-lg font-semibold text-gray-700"
                    }`}
                  >
                    {train.trainName}
                  </h3>
                  <span className="text-xs lg:text-sm font-medium bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    #{train.trainNumber}
                  </span>
                </div>

                {/* Operating Days */}
                <span
                  className={`${
                    isMobile
                      ? "hidden"
                      : "text-xs lg:text-xs text-gray-500 font-medium bg-blue-100 px-3 py-1 rounded-full"
                  }`}
                >
                  Runs on:{" "}
                  <span className="text-blue-500 text-xs">
                    {train.operatingDays
                      .sort(
                        (a, b) =>
                          [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].indexOf(a) -
                          [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].indexOf(b)
                      )
                      .join(", ")}
                  </span>
                </span>
              </div>

              {/* Time Details */}
              <div className="flex justify-between items-center mb-4">
                {/* Departure Details */}
                <div className="flex flex-col">
                  {/* Time and Date Side by Side for Departure */}
                  <div className="flex items-center">
                    {/* Time */}
                    <p
                      className={`${
                        isMobile
                          ? "text-gray-800 text-base font-medium mr-2"
                          : "text-gray-800 text-2xl font-semibold mr-2"
                      }`}
                    >
                      {new Date(train.adjustedDepartureTime).toLocaleTimeString(
                        "en-GB",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                    {/* Date */}
                    <p
                      className={`${
                        isMobile
                          ? "text-xs font-medium text-gray-600"
                          : "text-xl text-gray-600"
                      }`}
                    >
                      {new Date(train.adjustedDepartureTime).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                        }
                      )}
                    </p>
                  </div>
                  {/* Source */}
                  <p
                    className={`${
                      isMobile
                        ? "text-xs text-gray-600 font-semibold ml-1"
                        : "text-sm text-gray-600 font-semibold ml-1"
                    }`}
                  >
                    {train.source}
                  </p>
                </div>

                <p
                  className={`${
                    isMobile
                      ? "text-gray-500 text-xs py-2 px-4 border-b border-gray-300"
                      : "text-gray-500 text-sm py-2 px-4 border-b border-gray-300"
                  }`}
                >
                  {!isMobile && "Duration: "} {train.estimatedTime.toFixed(1)}{" "}
                  hours
                </p>

                {/* Arrival Details */}
                <div className="flex flex-col items-end">
                  {/* Time and Date Side by Side for Arrival */}
                  <div className="flex items-center">
                    {/* Time */}
                    <p
                      className={`${
                        isMobile
                          ? "text-gray-800 text-base font-medium mr-2"
                          : "text-gray-800 text-2xl font-semibold mr-2"
                      }`}
                    >
                      {new Date(
                        train.arrivalTimeAtDestination
                      ).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {/* Date */}
                    <p
                      className={`${
                        isMobile
                          ? "text-xs text-gray-600 font-medium"
                          : "text-xl text-gray-600"
                      }`}
                    >
                      {new Date(
                        train.arrivalTimeAtDestination
                      ).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                  {/* Destination */}
                  <p
                    className={`${
                      isMobile
                        ? "text-xs text-gray-600 font-semibold ml-1"
                        : "text-sm text-gray-600 font-semibold ml-1"
                    }`}
                  >
                    {searchParams.toCity}
                  </p>
                </div>
              </div>

              {/* Compartment Details */}
              <div
                className={`flex ${
                  isMobile ? "overflow-x-auto gap-4" : "flex-wrap gap-4"
                }`}
              >
                {train.compartments.map((compartment, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCompartmentClick(train, compartment)}
                    className={`bg-gray-200 p-2 rounded-lg text-center ${
                      isMobile ? "min-w-40" : "w-44"
                    } ${
                      compartment.availableSeats > 0
                        ? "bg-green-200 cursor-pointer"
                        : "bg-red-200 cursor-not-allowed"
                    }`}
                  >
                    <p
                      className={`${
                        isMobile
                          ? "font-medium text-sm text-gray-600 text-start mb-2"
                          : "font-bold text-gray-600 text-start mb-2"
                      }`}
                    >
                      {compartment.compartmentType}
                    </p>
                    {compartment.availableSeats > 0 ? (
                      <>
                        <div
                          className={`${
                            isMobile
                              ? "flex justify-between items-center gap-6"
                              : "flex justify-between items-center"
                          }`}
                        >
                          <p
                            className={`${
                              isMobile
                                ? "text-green-700 font-semibold text-xs"
                                : "text-green-700 font-semibold"
                            }`}
                          >
                            Available {compartment.availableSeats}
                          </p>
                          <p
                            className={`${
                              isMobile
                                ? "text-gray-800 font-semibold text-sm"
                                : "text-gray-800 font-semibold"
                            }`}
                          >
                            ₹
                            {calculatePrice(
                              compartment.compartmentType,
                              train.totalDistance
                            )}
                          </p>
                        </div>
                      </>
                    ) : (
                      <p className="text-red-700 font-semibold">
                        Not Available
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {!loading && trainList.length === 0 && (
        <p className="text-center text-gray-600 text-lg">
          No trains available for this route and date.
        </p>
      )}
      <ToastContainer />
    </div>
  );
};

export default AvailableTrains;
