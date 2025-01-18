import express from "express";
import {
  addTrain,
  getTrains,
  // getTrainById,
  updateTrain,
  deleteTrain,
  scheduleTrain,
  getTrainSchedules,
  addRoute,
  getRoutes,
  getCities,
} from "../controllers/trainController.js"; // Named imports
import { trainSearch } from "../controllers/trainSearchController.js";
import {
  getBookingById,
  checkUserBooking,
} from "../controllers/trainBookingController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { authorizeAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Routes for train management
router.post("/addTrain", authenticate, authorizeAdmin, addTrain); // Add new train (Admin only)
router.get("/getTrains", authenticate, getTrains); // Get all trains (Authenticated users)
// router.get("/:trainId", authenticate, getTrainById); // Get train by ID (Authenticated users)
router.put("/updateTrain/:id", authenticate, authorizeAdmin, updateTrain); // Update train (Admin only)
router.delete("/trains/:id", authenticate, authorizeAdmin, deleteTrain); // Delete train (Admin only)

// Routes for scheduling trains
router.post(
  "/scheduleTrain/:trainId",
  authenticate,
  authorizeAdmin,
  scheduleTrain
); // Schedule train (Admin only)
router.get("/getTrainSchedules/:trainId", authenticate, getTrainSchedules); // Get schedules for a specific train (Authenticated users)

// Routes for managing train routes
router.post("/addRoute", authenticate, authorizeAdmin, addRoute); // Add a new route (Admin only)
router.get("/getRoutes", authenticate, getRoutes); // Get all routes (Authenticated users)

// Route for getting cities based on a query
// Route to add cities
router.get("/getCities", authenticate, getCities);

// Route for searching trains
router.get("/searchTrains", authenticate, trainSearch);

//route for booking
router.get("/getBookingById", authenticate, getBookingById);
router.post("/checkUserBooking", authenticate, checkUserBooking);

export default router;
