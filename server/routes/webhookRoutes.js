import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Use raw body parser for webhook verification
router.post(
  "/webhook-catcher",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.error("Endpoint secret is not defined.");
      return res.status(500).send("Server configuration error.");
    }

    let event;

    try {
      // Verify the webhook signature using the raw body
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook error: ${err.message}`);
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        // Extract metadata and success data
        const { metadata } = session;
        let successData;

        try {
          successData = JSON.parse(metadata.successData);
        } catch (err) {
          console.error("Failed to parse metadata.successData:", err.message);
          return res.status(400).send("Invalid metadata format.");
        }

        // Direct API call for booking tickets (no reliance on cookies)
        try {
          console.log("Calling backend booking API...");
          const response = await axios.post(
            `${process.env.BACKEND_URL}/api/bookTrainTickets/bookTrainTickets`,
            { successData },
            {
              headers: {
                Authorization: `Bearer ${process.env.WEBHOOK_API_TOKEN}`, // Use a pre-configured secret token for webhook calls
              },
            }
          );

          if (response.status === 201) {
            // Respond with success to Stripe
            return res.status(200).send("Payment processed and ticket booked.");
          } else {
            res.status(500).send("Error booking ticket after payment.");
          }
        } catch (error) {
          console.error("Booking API error:", error.message);
          res.status(500).send("Error booking ticket after payment.");
        }
        break;
      }

      case "payment_intent.succeeded":
        console.log("Payment Intent Succeeded:", event.data.object);
        res.status(200).send("Event received.");
        break;

      case "charge.succeeded":
        console.log("Charge Succeeded:", event.data.object);
        res.status(200).send("Event received.");
        break;

      case "charge.updated":
        console.log("Charge Updated:", event.data.object);
        res.status(200).send("Event received.");
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        res.status(400).send(`Webhook event type ${event.type} not handled.`);
    }
  }
);

export default router;
