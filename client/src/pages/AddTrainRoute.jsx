/* eslint-disable no-unused-vars */
import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTrainRoute = () => {
  const [routeName, setRouteName] = useState("");
  const [stations, setStations] = useState([]);
  const [stationInput, setStationInput] = useState("");
  const [distanceFromPrevious, setDistanceFromPrevious] = useState("");
  const [distanceToNext, setDistanceToNext] = useState("");
  const [error, setError] = useState("");

  // Handle adding a new station
  const handleAddStation = () => {
    if (!stationInput.trim()) {
      toast.error("Station name is required.");
      return;
    }

    const station = {
      id: stations.length + 1,
      name: stationInput.trim(),
      distanceFromPrevious: distanceFromPrevious.trim()
        ? parseFloat(distanceFromPrevious.trim())
        : null,
      distanceToNext: distanceToNext.trim()
        ? parseFloat(distanceToNext.trim())
        : null,
    };

    // Ensure previous station's distanceToNext is filled
    if (
      stations.length > 0 &&
      stations[stations.length - 1].distanceToNext === null
    ) {
      toast.error(
        `Please provide 'distanceToNext' for the previous station: ${
          stations[stations.length - 1].name
        }.`
      );
      return;
    }

    // Add station
    setStations([...stations, station]);

    // Reset inputs
    setStationInput("");
    setDistanceFromPrevious("");
    setDistanceToNext("");
  };

  // Handle removing a station
  const handleRemoveStation = (stationId) => {
    const updatedStations = stations.filter(
      (station) => station.id !== stationId
    );
    setStations(updatedStations);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!routeName || stations.length === 0) {
      setError("Route name and at least one station are required.");
      toast.error("Route name and at least one station are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You are not authenticated. Please log in.");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/trains/addRoute",
        {
          routeName,
          stations: stations.map((station) => ({
            stationName: station.name,
            distanceFromPrevious: station.distanceFromPrevious,
            distanceToNext: station.distanceToNext,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setRouteName("");
        setStations([]);
        setError("");
        toast.success("Route added successfully!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to add route. Please try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-300 rounded-lg shadow-2xl space-y-1 mt-0">
      <ToastContainer position="top-center" autoClose={3000} />
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Route Name */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">
            Route Name
          </label>
          <input
            type="text"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter route name"
            required
          />
        </div>

        {/* Add Stations */}
        <div>
          <label className="block text-gray-600 font-medium mb-2">
            Add Stations
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={stationInput}
              onChange={(e) => setStationInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter station name"
            />
            <input
              type="number"
              value={distanceFromPrevious}
              onChange={(e) => setDistanceFromPrevious(e.target.value)}
              className="w-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="From Previous (km)"
            />
            <input
              type="number"
              value={distanceToNext}
              onChange={(e) => setDistanceToNext(e.target.value)}
              className="w-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="To Next (km)"
            />
            <button
              type="button"
              onClick={handleAddStation}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add
            </button>
          </div>

          {/* List of Stations */}
          {stations.length > 0 && (
            <div className="mt-3 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded-lg border border-gray-300">
              <ul className="space-y-2">
                {stations.map((station, index) => (
                  <li
                    key={station.id}
                    className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-lg"
                  >
                    <span>
                      {index + 1}. {station.name}{" "}
                      {station.distanceFromPrevious !== null &&
                        `- From Previous: ${station.distanceFromPrevious} km `}
                      {station.distanceToNext !== null &&
                        `- To Next: ${station.distanceToNext} km`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveStation(station.id)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Route
        </button>
      </form>
    </div>
  );
};

export default AddTrainRoute;
