/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaArrowRight, FaLocationArrow, FaMapMarkedAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { isMobile } from "react-device-detect"; // Importing isMobile from react-device-detect
import { useNavigate } from "react-router-dom";

const TrainSearch = ({ onSearch }) => {
  const [startDate, setStartDate] = useState(new Date());
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const navigate = useNavigate();

  // Handle date selection
  const handleDateChange = (newDate) => {
    setStartDate(newDate);
  };

  // Fetch city suggestions
  const fetchCitySuggestions = async (query, type) => {
    const token = localStorage.getItem("token");
    if (query.length > 2) {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/trains/getCities?query=${query}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (type === "from") {
          setFromSuggestions(Array.isArray(response.data) ? response.data : []);
        } else {
          setToSuggestions(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);

        if (error.response.data.message == "Invalid or expired token") {
          // Remove specific items
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
        }
      }
    }
  };

  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === "from") {
      setFromCity(value);
      fetchCitySuggestions(value, "from");
    } else {
      setToCity(value);
      fetchCitySuggestions(value, "to");
    }
  };

  const handleCitySelect = (city, type) => {
    if (type === "from") {
      setFromCity(city.name);
      setFromSuggestions([]);
    } else {
      setToCity(city.name);
      setToSuggestions([]);
    }
  };

  // Search Button Handler
  const handleSearch = () => {
    // Ensure fromCity and toCity are arrays, create new variables to avoid reassigning constants
    const normalizedFromCity = Array.isArray(fromCity) ? fromCity : [fromCity];
    const normalizedToCity = Array.isArray(toCity) ? toCity : [toCity];

    // Capitalize each city in the arrays
    const capitalizedFromCity = normalizedFromCity.map(
      (city) => city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    );
    const capitalizedToCity = normalizedToCity.map(
      (city) => city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
    );

    // Pass the data to the parent component via onSearch callback
    onSearch({
      fromCity: capitalizedFromCity,
      toCity: capitalizedToCity,
      startDate,
    });
  };

  // City Suggestions Component
  const CitySuggestions = ({ suggestions, handleCitySelect, type }) => {
    return (
      suggestions.length > 0 && (
        <ul className="absolute bg-white border border-gray-300 rounded-lg w-full mt-2 max-h-48 overflow-y-auto z-10">
          {suggestions.slice(0, 3).map((city, index) => (
            <li
              key={index}
              className="px-4 py-2 text-sm cursor-pointer hover:bg-blue-500 hover:text-white font-medium"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleCitySelect(city, type)}
            >
              {city.name} <small className="text-gray-500">{city.state}</small>
            </li>
          ))}
        </ul>
      )
    );
  };

  return (
    <div
      className={`bg-[#d2dfed] opacity-90 shadow-xl p-12 max-w-full mx-auto ${
        isMobile ? "w-full mt-28" : "max-w-4xl flex rounded-full mt-5 pb-16"
      }`}
    >
      <div
        className={`flex ${
          isMobile ? "flex-col gap-4" : "flex-row items-center gap-8"
        }`}
      >
        {/* FROM Input */}
        <div className={`flex flex-col ${isMobile ? "w-full mb-5" : "w-1/4"}`}>
          <label
            className={`text-md font-semibold text-blue-900 ${
              isMobile ? "mb-0" : "mb-1"
            }`}
          >
            From
          </label>
          <div className="relative">
            <div className="flex items-center gap-2 border-b-[2px] border-gray-600 focus-within:border-blue-800 focus-within:border-b-[3px]">
              <FaLocationArrow className="text-blue-900 text-lg" />
              <input
                type="text"
                placeholder="Enter Departure City"
                className="w-full focus:outline-none px-2 py-2 text-gray-700 text-lg placeholder-gray-500 font-medium placeholder:font-normal bg-[#d2dfed]"
                value={fromCity}
                onChange={(e) => handleInputChange(e, "from")}
                onBlur={() => setFromSuggestions([])}
              />
            </div>
            <CitySuggestions
              suggestions={fromSuggestions}
              handleCitySelect={handleCitySelect}
              type="from"
            />
          </div>
        </div>

        {/* Arrow Icon */}
        <div className={`${isMobile ? "hidden" : "text-center"}`}>
          <FaArrowRight className="text-blue-900 text-xl" />
        </div>

        {/* TO Input */}
        <div className={`flex flex-col ${isMobile ? "w-full mb-4" : "w-1/4"}`}>
          <label
            className={`text-md font-semibold text-blue-900 ${
              isMobile ? "mb-0" : "mb-1"
            }`}
          >
            To
          </label>
          <div className="relative">
            <div className="flex items-center gap-2 border-b-2 border-gray-500 focus-within:border-blue-800 focus-within:border-b-[3px]">
              <FaMapMarkedAlt className="text-blue-900 text-lg" />
              <input
                type="text"
                placeholder="Enter Destination City"
                className="w-full focus:outline-none px-2 py-2 text-gray-700 text-lg placeholder-gray-500 font-semibold placeholder:font-normal bg-[#d2dfed]"
                value={toCity}
                onChange={(e) => handleInputChange(e, "to")}
                onBlur={() => setToSuggestions([])}
              />
            </div>
            <CitySuggestions
              suggestions={toSuggestions}
              handleCitySelect={handleCitySelect}
              type="to"
            />
          </div>
        </div>

        {/* Date Picker */}
        <div className={`flex flex-col ${isMobile ? "w-full" : "w-1/4"}`}>
          <label className="text-md font-semibold text-blue-900 mb-1">
            Departure Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            minDate={new Date()}
            dateFormat="dd/MM/yyyy"
            className="date-picker"
          />
        </div>
      </div>

      {/* Search Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSearch}
          className={`${
            isMobile
              ? "bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg w-full"
              : "search_btn"
          }`}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default TrainSearch;
