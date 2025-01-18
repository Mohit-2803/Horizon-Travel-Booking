import mongoose from "mongoose";

// Route schema to define the list of intermediate stations and distances
const routeSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
  },
  stations: [
    {
      stationName: {
        type: String,
        required: true,
      },
      distanceFromPrevious: {
        type: Number, // Distance from the previous station
        required: false, // Optional for the first station
      },
      distanceToNext: {
        type: Number, // Distance to the next station
        required: false, // Optional for the last station
      },
    },
  ],
});

const Route = mongoose.model("Route", routeSchema);

export default Route;
