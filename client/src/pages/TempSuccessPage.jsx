import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate for navigation
import { useEffect, useState } from "react";

const TempSuccessPage = () => {
  const [booked, setBooked] = useState(false); // Set the booked state to false initially
  const navigate = useNavigate();

  useEffect(() => {
    window.history.replaceState({}, "");
    // Simulate ticket booking process and set booked state
    if (!booked) {
      setBooked(true);
      // Set the token "bookedTicket" in localStorage
      localStorage.setItem(
        "bookedTicket",
        JSON.stringify({ status: true, timestamp: Date.now() })
      );
    }
  }, [booked, navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-[70vh] bg-blue-50">
      <DotLottieReact
        src="https://lottie.host/0d1ca0e5-9b25-4d11-8238-f09954f7ee1e/4Dd80XSTE0.lottie"
        loop={false}
        autoplay
        className="w-40 h-40"
      />
      <h1 className="mt-6 text-3xl font-bold text-green-500">
        Ticket Booked Successfully!
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        To view your ticket, go to the{" "}
        <Link
          to="/profile" // Navigate to the profile section
          className="font-semibold text-blue-500 hover:text-blue-700 transition-all"
        >
          Profile
        </Link>{" "}
        section.
      </p>
    </div>
  );
};

export default TempSuccessPage;
