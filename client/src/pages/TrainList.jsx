/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrainList = () => {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null); // Track selected train
  const [selectedSchedule, setSelectedSchedule] = useState(null); // Track selected schedule
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode

  const token = localStorage.getItem("token");

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours === 0) {
      return `${mins}M`;
    } else {
      return `${hours}H ${mins}M`;
    }
  };

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/trains/getTrains",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTrains(response.data);
        setLoading(false);
      } catch (err) {
        setError(`Failed to load trains: ${err.message}`);
        setLoading(false);
        toast.error(`Failed to load trains: ${err.message}`);
      }
    };

    fetchTrains();
  }, [token]);

  const handleEditClick = async (train) => {
    setSelectedTrain(train);
    try {
      // Fetch the schedule for the selected train
      const scheduleResponse = await axios.get(
        `http://localhost:5000/api/trains/getTrainSchedules/${train._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle empty schedule or successful response
      if (!scheduleResponse.data || scheduleResponse.data.length === 0) {
        setSelectedSchedule({
          departureTime: "",
          arrivalTime: "",
          operatingDays: [],
        });
        setIsEditing(true);
        toast.info("No schedule found. You can add a new schedule.");
      } else {
        setSelectedSchedule(scheduleResponse.data[0]); // Use the first schedule if available
        setIsEditing(true);
      }
    } catch (err) {
      // Handle 404 (No schedules found) gracefully
      if (err.response && err.response.status === 404) {
        toast.info("No schedule found. You can add a new schedule.");
        setSelectedSchedule({
          departureTime: "",
          arrivalTime: "",
          operatingDays: [],
        });
        setIsEditing(true);
      } else {
        // Handle other errors
        setError(`Failed to fetch schedule: ${err.message}`);
        toast.error(`Failed to fetch schedule: ${err.message}`);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedTrain(null);
    setSelectedSchedule(null);
    toast.info("Edit canceled.");
  };

  const handleUpdateTrain = async (updatedTrain, updatedSchedule) => {
    try {
      // First, update the train
      const response = await axios.put(
        `http://localhost:5000/api/trains/updateTrain/${updatedTrain._id}`,
        updatedTrain,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Then, update the schedule if it exists
      if (updatedSchedule) {
        await axios.post(
          `http://localhost:5000/api/trains/scheduleTrain/${updatedTrain._id}`,
          updatedSchedule,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      // Update the train in the local state
      setTrains((prevTrains) =>
        prevTrains.map((train) =>
          train.id === updatedTrain.id ? updatedTrain : train
        )
      );
      setIsEditing(false);
      setSelectedTrain(null);
      setSelectedSchedule(null);
      toast.success("Train details updated successfully!");
    } catch (err) {
      setError(`Failed to update train: ${err.message}`);
      toast.error(`Failed to update train: ${err.message}`);
    }
  };

  if (loading) {
    return <p>Loading trains...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <ToastContainer />
      {/* Train Edit Form or List */}
      {isEditing ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Edit Train Details</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdateTrain(selectedTrain, selectedSchedule);
            }}
            className="space-y-4"
          >
            <div className="flex space-x-4">
              <div className="w-full">
                <label htmlFor="trainName" className="block text-gray-600">
                  Train Name
                </label>
                <input
                  type="text"
                  id="trainName"
                  value={selectedTrain.trainName}
                  onChange={(e) =>
                    setSelectedTrain({
                      ...selectedTrain,
                      trainName: e.target.value,
                    })
                  }
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>
              <div className="w-full">
                <label htmlFor="trainNumber" className="block text-gray-600">
                  Train Number
                </label>
                <input
                  type="text"
                  id="trainNumber"
                  value={selectedTrain.trainNumber}
                  onChange={(e) =>
                    setSelectedTrain({
                      ...selectedTrain,
                      trainNumber: e.target.value,
                    })
                  }
                  className="w-full border px-4 py-2 rounded-lg"
                  required
                />
              </div>
            </div>

            {/* Schedule Section */}
            <h3 className="text-xl font-semibold text-gray-700">
              Edit Schedule
            </h3>

            <div className="w-full">
              <label htmlFor="departureTime" className="block text-gray-600">
                Departure Time
              </label>
              <input
                type="time"
                id="departureTime"
                value={selectedSchedule.departureTime}
                onChange={(e) =>
                  setSelectedSchedule({
                    ...selectedSchedule,
                    departureTime: e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-lg"
                required
              />
            </div>

            <div className="w-full">
              <label htmlFor="arrivalTime" className="block text-gray-600">
                Arrival Time
              </label>
              <input
                type="time"
                id="arrivalTime"
                value={selectedSchedule.arrivalTime}
                onChange={(e) =>
                  setSelectedSchedule({
                    ...selectedSchedule,
                    arrivalTime: e.target.value,
                  })
                }
                className="w-full border px-4 py-2 rounded-lg"
                required
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-600">Operating Days</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label key={day} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={day}
                      checked={selectedSchedule.operatingDays?.includes(day)} // Check if the day is already selected
                      onChange={(e) => {
                        const { value, checked } = e.target;
                        setSelectedSchedule((prevSchedule) => {
                          const updatedDays = checked
                            ? [...(prevSchedule.operatingDays || []), value] // Add day if checked
                            : (prevSchedule.operatingDays || []).filter(
                                (d) => d !== value
                              ); // Remove day if unchecked
                          return {
                            ...prevSchedule,
                            operatingDays: updatedDays,
                          };
                        });
                      }}
                      className="form-checkbox"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-x-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="border border-gray-200 px-4 py-2">#</th>
              <th className="border border-gray-200 px-4 py-2">Train Name</th>
              <th className="border border-gray-200 px-4 py-2">Train Number</th>
              <th className="border border-gray-200 px-4 py-2">Source</th>
              <th className="border border-gray-200 px-4 py-2">Destination</th>
              <th className="border border-gray-200 px-4 py-2">Duration</th>
              <th className="border border-gray-200 px-4 py-2">Status</th>
              <th className="border border-gray-200 px-4 py-2">Scheduled</th>
              <th className="border border-gray-200 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trains.map((train, index) => (
              <tr key={train.id || index} className="hover:bg-gray-100">
                <td className="border border-gray-200 px-4 py-2 text-center">
                  {index + 1}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {train.trainName}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {train.trainNumber}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {train.source}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {train.destination}
                </td>
                <td className="border border-gray-200 px-4 py-2">
                  {formatDuration(train.estimatedDuration)}
                </td>

                {/* Display Status with Minimal Padding, Centered Text, and Small Color Background */}
                <td
                  className={`border border-gray-200 px-1 py-3 rounded-full text-sm font-medium flex items-center text-center pl-8 ${
                    train.status === "Running"
                      ? "bg-green-500 text-white"
                      : train.status === "Delayed"
                      ? "bg-yellow-500 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {train.status}
                </td>

                <td className="border border-gray-200 px-4 py-2">
                  <span
                    className={`inline-block w-4 h-4 rounded-full ${
                      train.isScheduled ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></span>
                  <span className="ml-2">
                    {train.isScheduled ? "Yes" : "Not"}
                  </span>
                </td>

                <td className="border border-gray-200 px-4 py-2 text-center">
                  <button
                    onClick={() => handleEditClick(train)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TrainList;
