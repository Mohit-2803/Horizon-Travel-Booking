/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import toastify
import "react-toastify/dist/ReactToastify.css";

const TrainForm = ({ onSuccess, onCancel }) => {
  const [trainData, setTrainData] = useState({
    trainName: "",
    trainNumber: "",
    source: "",
    destination: "",
    distance: "",
    estimatedDuration: "",
    compartments: [{ compartmentType: "", totalSeats: 0 }],
    quotas: "", // Added quotas field
    status: "", // Status field
    route: "", // New field for route
  });

  const [routes, setRoutes] = useState([]); // To store available routes

  // Fetch all routes on form load
  useEffect(() => {
    const token = localStorage.getItem("token"); // Adjust if you use sessionStorage or another storage method

    async function fetchRoutes() {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/trains/getRoutes",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in the Authorization header
            },
          }
        );
        setRoutes(response.data); // Assuming routes are returned from this endpoint
      } catch (error) {
        console.error("Error fetching routes", error);
      }
    }
    fetchRoutes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrainData({ ...trainData, [name]: value });
  };

  const handleCompartmentChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCompartments = [...trainData.compartments];
    updatedCompartments[index] = {
      ...updatedCompartments[index],
      [name]: value,
    };
    setTrainData({ ...trainData, compartments: updatedCompartments });
  };

  const handleAddCompartment = () => {
    setTrainData({
      ...trainData,
      compartments: [
        ...trainData.compartments,
        { compartmentType: "", totalSeats: 0 },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const enrichedCompartments = trainData.compartments.map(
        (compartment) => ({
          ...compartment,
          seats: Array.from({ length: compartment.totalSeats }, (_, i) => ({
            seatNumber: `${Math.ceil((i + 1) / 6)}${String.fromCharCode(
              65 + (i % 6)
            )}`,
            isAvailable: true,
          })),
        })
      );

      // Get the token from localStorage (adjust this based on how you're storing it)
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/api/trains/addTrain",
        { ...trainData, compartments: enrichedCompartments },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Adding the token in the Authorization header
          },
        }
      );
      console.log("Train added successfully:", response.data);

      // Show success toast
      toast.success("Train added successfully!");

      onSuccess();
    } catch (error) {
      console.error(
        "Error adding train:",
        error.response?.data || error.message
      );

      // Show error toast
      toast.error(`Error adding train: ${error.message}`);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <ToastContainer />

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="trainName"
          placeholder="Train Name"
          value={trainData.trainName}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          name="trainNumber"
          placeholder="Train Number"
          value={trainData.trainNumber}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="source"
            placeholder="Source"
            value={trainData.source}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg"
          />
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={trainData.destination}
            onChange={handleChange}
            required
            className="px-4 py-2 border rounded-lg"
          />
        </div>
        <input
          type="number"
          name="distance"
          placeholder="Distance (km)"
          value={trainData.distance}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="text"
          name="estimatedDuration"
          placeholder="Estimated Duration (hours)"
          value={trainData.estimatedDuration}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        {/* Status field dropdown */}
        <select
          name="status"
          value={trainData.status}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="" disabled>
            Select Status
          </option>
          <option value="Running">Running</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Delayed">Delayed</option>
        </select>
        {/* Quotas field input */}
        <input
          type="text"
          name="quotas"
          placeholder="Quotas (e.g., General, Sleeper, AC)"
          value={trainData.quotas}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
        {/* Route selection */}
        <select
          name="route"
          value={trainData.route}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded-lg"
        >
          <option value="" disabled>
            Select Route
          </option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>
              {route.routeName}
            </option>
          ))}
        </select>
        <div className="space-y-2">
          {trainData.compartments.map((compartment, index) => (
            <div key={index} className="flex gap-4 items-center">
              <input
                type="text"
                name="compartmentType"
                placeholder="Compartment Type"
                value={compartment.compartmentType}
                onChange={(e) => handleCompartmentChange(index, e)}
                required
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                name="totalSeats"
                placeholder="Total Seats"
                value={compartment.totalSeats}
                onChange={(e) => handleCompartmentChange(index, e)}
                required
                className="w-28 px-4 py-2 border rounded-lg"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCompartment}
            className="text-blue-500 hover:underline"
          >
            + Add Compartment
          </button>
        </div>
        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-lg"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="ml-4 bg-gray-300 px-6 py-2 rounded-lg"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TrainForm;
