import mongoose from "mongoose";

// Seat schema (unchanged)
const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

// Compartment schema (unchanged)
const compartmentSchema = new mongoose.Schema({
  compartmentType: {
    type: String,
    enum: ["1AC", "2AC", "3AC", "Sleeper", "General"],
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  seats: [seatSchema],
});

// Train schema
const trainSchema = new mongoose.Schema({
  trainName: {
    type: String,
    required: true,
  },
  trainNumber: {
    type: String,
    required: true,
    unique: true,
  },
  source: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  estimatedDuration: {
    type: Number,
    required: true,
  },
  compartments: [compartmentSchema],
  quotas: {
    type: String,
    default: "General",
  },
  status: {
    type: String,
    enum: ["Running", "Cancelled", "Delayed"],
    default: "Running",
  },
  isScheduled: {
    type: Boolean,
    default: false,
  },
  route: {
    // Reference to the Route schema to identify the route
    type: mongoose.Schema.Types.ObjectId,
    ref: "Route",
    required: true,
  },
});

const Train = mongoose.model("Train", trainSchema);

export default Train;
