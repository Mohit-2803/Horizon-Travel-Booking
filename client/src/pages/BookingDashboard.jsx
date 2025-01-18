/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TrainSearch from "./TrainSearch";
import AvailableTrains from "./AvailableTrains";
import AdsInfo from "./AdsInfo"; // Ensure AdsInfo has a default export
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrain, faBus, faPlane } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import { isMobile } from "react-device-detect";
import { ClipLoader } from "react-spinners";

const BookingDashboard = () => {
  const [activeTab, setActiveTab] = useState("Trains");
  const [searchData, setSearchData] = useState(null);
  const [showAvailableTrains, setShowAvailableTrains] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state

  const navigate = useNavigate();
  const location = useLocation();

  // Function to check token validity
  const checkToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      setLoading(false);
    }
  };

  // Check token when the component mounts
  useEffect(() => {
    checkToken();

    if (location.state?.flagToastUser) {
      toast.success("You are logged-in");
      window.history.replaceState({}, ""); // Prevent showing the toast after page refresh
    }
  }, [location.state?.flagToastUser]);

  // Callback to handle search parameters
  const handleSearch = (data) => {
    setSearchData(data);
    setShowAvailableTrains(true); // Show AvailableTrains component
  };

  // Return a loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center">
          <ClipLoader color="#4A90E2" size={50} />
          <span className="mt-4 text-xl text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  const tabs = [
    {
      name: "Trains",
      icon: faTrain,
      color: "bg-gradient-to-r from-green-400 to-blue-500",
    },
    {
      name: "Buses",
      icon: faBus,
      color: "bg-gradient-to-r from-yellow-400 to-red-500",
    },
    {
      name: "Flights",
      icon: faPlane,
      color: "bg-gradient-to-r from-purple-400 to-pink-500",
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        isMobile
          ? "bg-gradient-to-br from-gray-100 to-gray-300"
          : "bg-gradient-to-br from-gray-100 to-gray-300"
      }`}
    >
      {/* Header with Tabs */}
      <div
        className={`flex items-center py-2 ${
          isMobile
            ? "bg-gradient-to-r from-blue-100 to-blue-50 shadow-lg px-4"
            : "bg-gradient-to-r from-blue-200 to-blue-100 shadow-lg pl-12"
        }`}
      >
        <div
          className={`flex ${
            isMobile ? "space-x-4" : "space-x-8 ml-6"
          } items-center`}
        >
          {tabs.map((tab) => (
            <div
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-4 py-2 cursor-pointer flex items-center gap-2 text-center ${
                activeTab === tab.name
                  ? "border-b-4 border-black black font-semibold"
                  : "text-blue-800 hover:text-blue-800"
              } transition-all duration-300 ease-in-out`}
            >
              <FontAwesomeIcon
                icon={tab.icon}
                size={isMobile ? "sm" : "lg"}
                className={`${
                  activeTab === tab.name
                    ? "text-black font-semibold"
                    : "text-blue-800"
                }`}
              />
              <span
                className={`${
                  isMobile ? "text-xs font-semibold" : "text-sm font-semibold"
                }`}
              >
                {tab.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Section */}
      <div className="space-y-8">
        {/* Train Tab */}
        {activeTab === "Trains" && !showAvailableTrains && (
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/259280/pexels-photo-259280.jpeg?cs=srgb&dl=pexels-pixabay-259280.jpg&fm=jpg"
              alt="Train Booking"
              className={`${
                isMobile ? "w-full min-h-[500px]" : "w-full h-96"
              } object-cover  shadow-lg`}
            />
            <div
              className={`absolute top-0 left-0 right-0 bottom-0 bg-black ${
                isMobile ? "opacity-50" : "opacity-60"
              }`}
            ></div>
            <div
              className={`${
                isMobile
                  ? "absolute -top-28 left-0 right-0 bottom-0 flex justify-center items-center mx-5"
                  : "absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center"
              }`}
            >
              <TrainSearch onSearch={handleSearch} />
            </div>
          </div>
        )}

        {/* AvailableTrains Component */}
        {showAvailableTrains && <AvailableTrains searchParams={searchData} />}

        {/* Ads Section */}
        {!showAvailableTrains && <AdsInfo />}
      </div>

      <ToastContainer />
    </div>
  );
};

export default BookingDashboard;
