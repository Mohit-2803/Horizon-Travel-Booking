import dotenv from "dotenv";
import express from "express";
import Stripe from "stripe";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Payment Intent
router.post("/create-checkout-session", async (req, res) => {
  const { base, gst, total, bookingData } = req.body; // Destructure the amount, base, gst, total

  if (!total || total <= 0) {
    return res.status(400).json({ error: "Invalid amount." });
  }

  const successData = {
    userId: bookingData.userId,
    trainNumber: bookingData.trainDetails.trainNumber,
    compartmentType: bookingData.compartmentType,
    passengerDetails: bookingData.passengerDetails,
    journeyDate: bookingData.journeyDate,
    price: bookingData.price,
    fromCity: bookingData.trainDetails.source[0],
    toCity: bookingData.trainDetails.destination[0],
  };

  // Stringify the successData for Stripe metadata
  const successDataStringified = JSON.stringify(successData);

  try {
    // Create a Checkout session with line items, including base, gst, and total
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Train Ticket",
              description: "Inclusive GST price",
            },
            unit_amount: Math.round(total * 100), // Convert to paise (INR cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      metadata: {
        base: base.toString(), // Convert base to string
        gst: gst.toString(), // Convert GST to string
        total: total.toString(), // Convert total to string
        successData: successDataStringified, // Pass stringified successData
      },
    });

    // Respond with sessionId for the frontend to redirect to Stripe Checkout
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error("Stripe Session Creation Error:", error);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});

export default router;
