import express from "express";
import { bookTrainTickets } from "../controllers/trainBookingController.js";

const router = express.Router();

// POST endpoint to handle train ticket booking
router.post("/bookTrainTickets", bookTrainTickets);

export default router;
