import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema({
  train: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train", // Reference to the Train model
    required: true,
  },
  operatingDays: {
    type: [String], // Array of days the train operates, e.g. ['Monday', 'Wednesday', 'Friday']
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  departureTime: {
    type: String,
    required: true, // Time of departure in HH:MM format (24-hour clock)
  },
  arrivalTime: {
    type: String,
    required: true, // Time of arrival in HH:MM format (24-hour clock)
  },
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
