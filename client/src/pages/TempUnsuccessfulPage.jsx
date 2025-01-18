import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate for navigation

import { useEffect } from "react";

const TempUnsuccessfulPage = () => {
  const navigate = useNavigate(); // useNavigate hook to programmatically navigate

  useEffect(() => {
    // Disable back navigation by pushing multiple states into the history stack
    const handlePopState = (event) => {
      event.preventDefault(); // Prevent going back
      navigate("/"); // Redirect to the desired route (can be home or a fixed page)
    };

    window.history.pushState(null, document.title); // Push a state to history to block back
    window.history.pushState(null, document.title); // Push another state to make it harder to go back
    window.addEventListener("popstate", handlePopState); // Listen for back button press

    return () => {
      // Clean up event listener on component unmount
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-[70vh] bg-red-50">
      <DotLottieReact
        src="https://lottie.host/be6231fc-9a40-4a20-8fb9-58f463b997e7/ZEOPSr5wmj.lottie"
        loop
        autoplay
        className="w-40 h-40"
      />
      <h1 className="mt-6 text-3xl font-bold text-red-500">
        Ticket Booking Unsuccessful!
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Something went wrong. Please try again or contact support. You can go
        back to{" "}
        <Link
          to="/"
          className="font-semibold text-blue-500 hover:text-blue-700 transition-all"
        >
          Home
        </Link>{" "}
        page.
      </p>
    </div>
  );
};

export default TempUnsuccessfulPage;
