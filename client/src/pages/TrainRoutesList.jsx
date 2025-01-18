import { useEffect, useState, useCallback } from "react";
import axios from "axios";

const TrainRoutesList = () => {
  const [routes, setRoutes] = useState([]); // State for routes
  const [error, setError] = useState(""); // State for error handling
  const [loading, setLoading] = useState(true); // State for loading indicator

  const token = localStorage.getItem("token"); // Retrieve token from localStorage

  // Fetch routes from the API
  const fetchRoutes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!token) {
        setError("Unauthorized: Please log in to view routes.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/trains/getRoutes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(response.data)) {
        setRoutes(response.data);
      } else {
        throw new Error("Invalid response format for routes.");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch routes.");
    } finally {
      setLoading(false);
    }
  }, [token]); // Add token to dependencies

  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]); // Only trigger the effect when fetchRoutes changes

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center text-blue-700">
        Train Routes
      </h2>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-500 animate-pulse">
          Fetching routes, please wait...
        </p>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchRoutes}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
          >
            Retry
          </button>
        </div>
      )}

      {/* Routes List */}
      {!loading && !error && routes.length > 0 && (
        <div className="overflow-y-auto max-h-[350px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {routes.map((route) => (
              <div
                key={route._id}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300"
                aria-label={`Route ${route.routeName}`}
              >
                <h4 className="text-lg font-semibold text-blue-600 mb-3">
                  {route.routeName}
                </h4>
                <div className="border-t border-gray-200 pt-2">
                  <h5 className="text-md font-medium text-gray-700 mb-1">
                    Stations:
                  </h5>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600">
                    {route.stations.map((station, idx) => (
                      <li key={idx}>
                        <span className="font-medium text-gray-800">
                          {station.stationName}
                        </span>
                        {station.distanceToNext !== null && (
                          <span> - {station.distanceToNext} km</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Routes State */}
      {!loading && !error && routes.length === 0 && (
        <div className="text-center text-gray-500 space-y-4">
          <p>No train routes available at the moment.</p>
          <img
            src="https://via.placeholder.com/150"
            alt="No data illustration"
            className="mx-auto w-36 h-36"
          />
        </div>
      )}
    </div>
  );
};

export default TrainRoutesList;
