import mongoose from "mongoose";

const trainBookingSchema = new mongoose.Schema({
  pnr: {
    type: Number,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train",
    required: true,
  },
  source: {
    type: String,
    required: true, // Start station
  },
  destination: {
    type: String,
    required: true, // End station
  },
  passengerDetails: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        required: true,
      },
      seatNumber: { type: String, required: true },
    },
  ],
  totalSeats: {
    type: Number,
    required: true,
  },
  seatNumbers: {
    type: [String],
    required: true,
  },
  journeyDate: {
    type: Date,
    required: true,
  },
  bookingDate: {
    type: Date,
    default: Date.now, // The exact time the booking was made
  },
  totalFare: {
    type: Number,
    required: true,
  },
  compartmentType: {
    type: String,
  },
});

// Export the model with default export
const Booking = mongoose.model("Booking", trainBookingSchema);
export default Booking;
