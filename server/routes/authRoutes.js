import express from "express";
import {
  signup,
  verifyOtp,
  login,
  resendOtp,
  getUserById,
} from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; // Import the middleware
import { getUserBookingById } from "../controllers/trainBookingController.js";

const router = express.Router();

// User signup route (no authentication required)
router.post("/signup", signup);

// OTP verification route (no authentication required)
router.post("/verify-otp", verifyOtp);

//resend otp for unverified users
router.post("/send-otp", resendOtp);

// User login route (no authentication required)
router.post("/login", login); // This will be the login route

// Protected route (requires authentication)
router.get("/getUserById/:id", authenticate, getUserById);

// Route to get user bookings
router.get("/getUserBookingById/:userId", authenticate, getUserBookingById);

export default router;
