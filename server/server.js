import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser"; // Required for handling cookies
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import trainRoutes from "./routes/trainRoutes.js";
import trainBookRoutes from "./routes/trainBookRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js"; // Import payment routes
import { authenticate } from "./middlewares/authMiddleware.js"; // Authentication middleware

// Load environment variables from .env file
dotenv.config();

// Ensure essential environment variables are present
if (
  !process.env.JWT_SECRET ||
  !process.env.MONGO_URI ||
  !process.env.STRIPE_SECRET_KEY
) {
  console.error("Error: Missing required environment variables.");
  process.exit(1);
}

// Initialize express app
const app = express();

// Connect to the database
connectDB();

// Middleware for parsing cookies
app.use(cookieParser());

// Pre-flight handling for CORS
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // Allow pre-flight requests to go through
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, ngrok-skip-browser-warning"
    );
    res.header(
      "Access-Control-Allow-Origin",
      "https://horizon-omega-seven.vercel.app"
    ); // Your frontend URL here
    res.sendStatus(204); // Send 204 No Content as the response
  } else {
    next(); // Pass non-OPTIONS requests to the next handler
  }
});

// CORS configuration for handling actual requests
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow only your frontend domain to make requests
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "ngrok-skip-browser-warning",
    ], // Add ngrok header or any other custom header you might need
    credentials: true, // If cookies are being used (e.g., session cookies or JWT)
  })
);

// Middleware to parse JSON request bodies
// Use raw body for the webhook route
app.use((req, res, next) => {
  if (req.originalUrl === "/api/webhooks/webhook-catcher") {
    next(); // Skip JSON parsing for the webhook route
  } else {
    express.json()(req, res, next); // Parse JSON for all other routes
  }
});

// Routes
// Route to handle user authentication
app.use("/api/auth", authRoutes); // Auth routes for login, register, etc.

// Secure Routes: Trains (Only Authenticated Users)
app.use("/api/trains", authenticate, trainRoutes); // All train routes protected by authenticate middleware

// Secure Routes: Trains (Only Authenticated Users)
app.use("/api/bookTrainTickets", trainBookRoutes); // All train routes protected by authenticate middleware

// Payment Routes
app.use("/api/payments", authenticate, paymentRoutes); // Payment routes

import webhookRoutes from "./routes/webhookRoutes.js"; // Import the webhook route

// Use the webhook route
app.use("/api/webhooks", webhookRoutes); // The webhook will be available at /api/webhooks/webhook

// Handle undefined routes
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal Server Error", error: err.message });
});

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
