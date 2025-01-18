import { useState } from "react";
import TrainForm from "./TrainForm"; // Import TrainForm
import TrainList from "./TrainList"; // Import TrainList
import AddTrainRoute from "./AddTrainRoute"; // Import AddTrainRoute component
import TrainRoutesList from "./TrainRoutesList"; // Import TrainRoutesList component

const Trains = () => {
  const [showTrainForm, setShowTrainForm] = useState(false);
  const [showTrainRouteForm, setShowTrainRouteForm] = useState(false);
  const [showRoutesList, setShowRoutesList] = useState(false); // New state for showing routes list

  const handleAddTrainClick = () => {
    setShowTrainForm(true);
    setShowTrainRouteForm(false); // Hide AddRoute form when AddTrain form is shown
    setShowRoutesList(false); // Hide Routes List
  };

  const handleAddRouteClick = () => {
    setShowTrainRouteForm(true);
    setShowTrainForm(false); // Hide AddTrain form when AddRoute form is shown
    setShowRoutesList(false); // Hide Routes List
  };

  const handleShowRoutesClick = () => {
    setShowRoutesList(true); // Show routes list
    setShowTrainForm(false); // Hide Train form
    setShowTrainRouteForm(false); // Hide AddRoute form
  };

  const handleBackToListClick = () => {
    setShowTrainForm(false);
    setShowTrainRouteForm(false); // Hide both forms and show the train list
    setShowRoutesList(false); // Hide Routes List
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg space-y-2 mt-0">
      <div className="flex justify-start space-x-4">
        {/* Button to toggle between train list and train form */}
        {!showTrainForm && !showTrainRouteForm && !showRoutesList && (
          <>
            <button
              onClick={handleAddTrainClick}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
            >
              Add New Train
            </button>

            <button
              onClick={handleAddRouteClick}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105"
            >
              Add New Route
            </button>

            {/* New Button to show Routes List */}
            <button
              onClick={handleShowRoutesClick}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-200 ease-in-out transform hover:scale-105"
            >
              Show All Available Routes
            </button>
          </>
        )}
      </div>

      <h2 className="text-3xl font-semibold text-gray-800 mt-4">
        {showTrainForm
          ? "Add New Train"
          : showTrainRouteForm
          ? "Add New Route"
          : showRoutesList
          ? "All Available Routes"
          : "All Active Trains"}
      </h2>

      {/* Conditional Rendering */}
      {showTrainForm ? (
        <div className="space-y-4">
          <TrainForm />
          <button
            onClick={handleBackToListClick}
            className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200 ease-in-out"
          >
            Back to Train List
          </button>
        </div>
      ) : showTrainRouteForm ? (
        <div className="space-y-4">
          <AddTrainRoute />
          <button
            onClick={handleBackToListClick}
            className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200 ease-in-out"
          >
            Back to Train List
          </button>
        </div>
      ) : showRoutesList ? (
        <div className="space-y-4">
          <TrainRoutesList /> {/* Show routes list here */}
          <button
            onClick={handleBackToListClick}
            className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition duration-200 ease-in-out"
          >
            Back to Train List
          </button>
        </div>
      ) : (
        <TrainList />
      )}
    </div>
  );
};

export default Trains;
