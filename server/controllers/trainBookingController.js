import Train from "../models/TrainModel/trainSchema.js";
import Booking from "../models/TrainModel/trainBookingSchema.js";
import User from "../models/User.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Helper function to generate random PNR
const generateRandomPNR = () => {
  return Math.floor(100000000 + Math.random() * 900000000); // Generate a 9-digit random PNR
};

// Controller function to check if the user already has a booking for the same train on the same date
export const checkUserBooking = async (req, res) => {
  try {
    const { userId, trainNumber, journeyDate } = req.body;

    if (!userId || !trainNumber || !journeyDate) {
      return res.status(400).json({
        message: "User ID, train number, and journey date are required.",
      });
    }

    // Format journeyDate to YYYY-MM-DD
    const formattedJourneyDate = new Date(journeyDate)
      .toISOString()
      .split("T")[0]; // Format to YYYY-MM-DD

    // Find the train by trainNumber
    const train = await Train.findOne({ trainNumber });
    if (!train) {
      return res.status(404).json({ message: "Train not found." });
    }

    // Check if the user already has a booking for this train on the selected date
    const existingBooking = await Booking.findOne({
      userId,
      trainId: train._id,
      journeyDate: {
        $gte: new Date(formattedJourneyDate + "T00:00:00Z"),
        $lt: new Date(formattedJourneyDate + "T23:59:59Z"),
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        message:
          "You have already booked a ticket for this train on this date.",
      });
    }

    // If no existing booking is found
    res.status(200).json({
      message: "No existing booking found. You can proceed with booking.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const bookTrainTickets = async (req, res) => {
  try {
    const { authorization } = req.headers;

    // Check if the token is provided in the headers
    if (!authorization) {
      return res
        .status(401)
        .json({ message: "Authorization token is missing." });
    }

    // Extract the token from the header (Bearer scheme)
    const token = authorization.split(" ")[1];

    // Validate the token against the environment variable
    if (token !== process.env.WEBHOOK_API_TOKEN) {
      return res.status(403).json({ message: "Invalid authorization token." });
    }

    // Extract the successData from the body
    const successData = req.body.successData;

    // Check if successData exists and contains the required fields
    if (!successData) {
      return res.status(400).json({ message: "Missing successData." });
    }

    const {
      userId,
      trainNumber,
      price,
      compartmentType,
      passengerDetails,
      journeyDate,
      fromCity,
      toCity,
    } = successData;

    // Validate request payload
    if (
      !userId ||
      !trainNumber ||
      !compartmentType ||
      !passengerDetails ||
      !journeyDate
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!Array.isArray(passengerDetails) || passengerDetails.length === 0) {
      return res
        .status(400)
        .json({ message: "Passenger details are required." });
    }

    // Find the train by trainNumber (instead of trainId)
    const train = await Train.findOne({ trainNumber }).populate(
      "compartments.seats"
    );
    if (!train) {
      return res.status(404).json({ message: "Train not found." });
    }

    // Find the selected compartment
    const compartment = train.compartments.find(
      (comp) => comp.compartmentType === compartmentType
    );
    if (!compartment) {
      return res.status(404).json({ message: "Compartment type not found." });
    }

    const formattedJourneyDate = new Date(journeyDate)
      .toISOString()
      .split("T")[0]; // Format to YYYY-MM-DD

    // Check if there are enough available seats
    if (compartment.availableSeats < passengerDetails.length) {
      return res.status(400).json({
        message: `Not enough seats available. Only ${compartment.availableSeats} seats left.`,
      });
    }

    // Assign seats to the passengers
    const assignedSeats = [];
    for (let i = 0; i < passengerDetails.length; i++) {
      const availableSeat = compartment.seats.find((seat) => seat.isAvailable);
      if (!availableSeat) {
        return res
          .status(500)
          .json({ message: "Unexpected error in seat assignment." });
      }

      // Assign seat
      assignedSeats.push({
        ...passengerDetails[i],
        seatNumber: availableSeat.seatNumber,
      });

      // Mark seat as unavailable
      availableSeat.isAvailable = false;
    }

    // Update compartment available seats count
    compartment.availableSeats -= passengerDetails.length;
    await train.save();

    // Generate a random PNR
    const randomPNR = generateRandomPNR();

    // Create booking document
    const booking = new Booking({
      pnr: randomPNR,
      userId,
      trainId: train._id, // Using the actual train ID
      source: fromCity,
      destination: toCity,
      passengerDetails: assignedSeats,
      totalSeats: passengerDetails.length,
      seatNumbers: assignedSeats.map((p) => p.seatNumber),
      journeyDate: formattedJourneyDate,
      totalFare: price.total, // Ensuring price total is used correctly
      compartmentType,
    });

    // Save the booking
    await booking.save();

    // Return success response
    res.status(201).json({
      message: "Booking successful.",
      bookingId: booking._id,
      pnr: randomPNR,
      passengerDetails: assignedSeats,
      totalFare: price.total,
      trainNumber: trainNumber,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Controller function to fetch booking details by ID
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.query;

    // Validate the booking ID
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required." });
    }

    // Fetch the booking by ID
    const booking = await Booking.findById(bookingId).populate("trainId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Return booking details
    res.status(200).json({
      message: "Booking retrieved successfully.",
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// Controller function to fetch all bookings of a user
export const getUserBookingById = async (req, res) => {
  try {
    const userId = req.params.userId; // Extract userId from request params

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch bookings associated with the user
    const bookings = await Booking.find({ userId: userId });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }

    // Return user's bookings
    return res.status(200).json({ bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
