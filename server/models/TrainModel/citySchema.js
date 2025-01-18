import mongoose from "mongoose";

const cityLocationSchema = new mongoose.Schema(
  {
    location: {
      type: [[String]],
      required: true, // Array of arrays, each containing city name, station code, and state
      validate: {
        validator: function (arr) {
          return arr.every((location) => location.length === 3); // Ensure each location has exactly 3 elements
        },
        message:
          "Each location must have exactly 3 elements: [City Name, Station Code, State]",
      },
    },
  },
  {
    timestamps: true, // For tracking createdAt and updatedAt
  }
);

export default mongoose.model("CityLocation", cityLocationSchema);
