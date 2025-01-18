/* eslint-disable react-hooks/exhaustive-deps */
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { FaCreditCard, FaCalendarAlt, FaTrain, FaUsers } from "react-icons/fa"; // Import Font Awesome icons

const stripePromise = loadStripe(
  "pk_test_51QiFNmBlPI7kOrOTHBh3jC1fcyGdqGihTLOhZo3LGkIhRLnnHARqXdBBwog69B1TJgS9XofDeBQXrkeC9I7Pesl000bgxSGHVb"
);

function PaymentPage() {
  const { state: bookingData } = useLocation() || {}; // Destructure bookingData from location state
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Guard clause for when bookingData is not available
  useEffect(() => {
    if (!bookingData) {
      navigate("/"); // Redirect to home page immediately if bookingData is missing
    }
  }, [bookingData, navigate]); // Ensure this runs when bookingData is available or changes

  // Check token and perform necessary actions
  const checkToken = async () => {
    const token = localStorage.getItem("token");
    const bookedTicket = localStorage.getItem("bookedTicket");

    if (!token) {
      navigate("/login");
    } else if (bookedTicket || !bookingData) {
      navigate("/"); // Navigate to home if no booking data
    } else {
      setLoading(false);
    }
  };

  // Trigger the check on mount if bookingData exists
  useEffect(() => {
    if (bookingData) {
      checkToken(); // Only call checkToken if bookingData is available
    }
  }, [bookingData, navigate]);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const { base, gst, total } = bookingData.price;

      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/trains/checkUserBooking`,
          {
            userId: bookingData.userId,
            trainNumber: bookingData.trainDetails.trainNumber,
            journeyDate: bookingData.journeyDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        if (
          err.response.data.message ===
          "You have already booked a ticket for this train on this date."
        ) {
          toast.error(
            "You have already booked a ticket for this train on this date."
          );
        }
        setLoading(false);
        return;
      }

      const { data } = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/payments/create-checkout-session`,
        {
          base,
          gst,
          total,
          bookingData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { sessionId } = data;
      const stripe = await stripePromise;

      const { error } = await stripe.redirectToCheckout({ sessionId });

      if (error) {
        console.error("Stripe Checkout error:", error);
        toast.error("Payment failed!");
        setLoading(false);
      } else {
        // Store the booked ticket in localStorage upon successful redirection
        localStorage.setItem(
          "bookedTicket",
          JSON.stringify({ status: true, timestamp: Date.now() })
        );
        navigate("/"); // Redirect to home page after payment
      }
    } catch (error) {
      if (error.response?.data?.message === "Invalid or expired token") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
      }
      console.error("Error:", error);
      toast.error("Payment failed!");
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    // If bookingData is missing, immediately navigate to home and don't render the rest of the component
    return null;
  }

  return (
    <div className="payment-container max-w-lg mx-auto p-6 bg-white shadow-2xl rounded-lg my-8">
      <h1 className="text-4xl font-semibold text-center text-blue-800 mb-16">
        Secure Payment
      </h1>

      <div className="space-y-6">
        {/* Train Info */}
        <div className="flex items-center space-x-4">
          <FaTrain className="text-2xl text-blue-600" />
          <p className="text-lg font-medium">
            {bookingData?.trainDetails?.trainName || "Train Name not available"}
          </p>
        </div>

        {/* Compartment Type */}
        <div className="flex items-center space-x-4">
          <FaCreditCard className="text-2xl text-blue-600" />
          <p className="text-lg font-medium">
            {bookingData?.compartmentType || "Compartment Type not available"}
          </p>
        </div>

        {/* Passenger Info */}
        <div className="flex items-center space-x-4">
          <FaUsers className="text-2xl text-blue-600" />
          <p className="text-lg font-medium">
            Passengers: {bookingData?.passengerDetails?.length || 0}
          </p>
        </div>

        {/* Journey Date */}
        <div className="flex items-center space-x-4">
          <FaCalendarAlt className="text-2xl text-blue-600" />
          <p className="text-lg font-medium">
            Journey Date:{" "}
            {bookingData?.journeyDate
              ? new Date(bookingData.journeyDate).toLocaleDateString()
              : "Not Available"}
          </p>
        </div>

        <hr className="border-[2px]" />

        <div className="flex gap-4 items-center">
          {/* From Station */}
          <div className="flex items-center space-x-4">
            <p className="text-lg font-medium">
              From:{" "}
              <span className="font-semibold">
                {bookingData?.trainDetails?.source || "Source not available"}
              </span>
            </p>
          </div>

          {/* To Station */}
          <div className="flex items-center space-x-4">
            <p className="text-lg font-medium">
              To:{" "}
              <span className="font-semibold">
                {bookingData?.trainDetails?.destination ||
                  "Destination not available"}
              </span>
            </p>
          </div>
        </div>

        <hr className="border-[2px]" />

        {/* Payment Info */}
        <div className="flex items-center space-x-4">
          <p className="text-xl font-semibold text-gray-700">
            Amount to be paid:{" "}
            <span className="text-green-600 font-bold">
              ₹{bookingData?.price?.total || "0"}
            </span>
          </p>
        </div>
      </div>

      {/* Payment Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handleCheckout}
          disabled={loading} // Disable button when loading is true
          className={`payment_btn ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`} // Adjust styles for disabled state
        >
          {loading ? <span>Redirecting</span> : <span>Pay Now</span>}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default PaymentPage;
