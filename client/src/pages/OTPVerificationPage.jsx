/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { isMobile } from "react-device-detect";
import otpImage from "../assets/screenshot.png"; // Replace with actual image path
import logoImage from "../assets/logo.svg";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false); // State to track verification progress
  const navigate = useNavigate();
  const location = useLocation();

  // Handle OTP not sent case and check from which page the user arrived
  useEffect(() => {
    if (!location.state?.otpSent || !location.state?.email) {
      toast.error("OTP not sent. Redirecting to login.");
      navigate("/login"); // Redirect to login if OTP was not sent
    } else if (location.state?.loginOtpRedirect) {
      toast.success("Please verify your email before Log In");
    } else if (location.state?.fromSignup) {
      toast.success("OTP sent! Check your email to verify your account.");
    } else {
      toast.success("OTP sent! Check your email.");
    }
  }, [navigate, location.state]);

  // Handle OTP submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: OTP must be 6 digits and numeric
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Invalid OTP format. Must be 6 numeric digits.");
      return;
    }

    setIsVerifying(true); // Set verifying state to true when the request starts

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`,
        { otp, email: location.state?.email }
      );

      if (
        response.data.message ===
        "OTP verified successfully. User is now verified."
      ) {
        toast.success("OTP verified! Redirecting to login...");

        // Handle post-verification actions based on the source of the OTP request
        if (location.state?.fromSignup) {
          setTimeout(() => {
            navigate("/login"); // Navigate to login after successful signup verification
          }, 2000);
        } else {
          setTimeout(() => {
            navigate("/login"); // Navigate to login after successful verification from login page
          }, 2000);
        }
      } else {
        toast.error(response.data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred during OTP verification. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false); // Set verifying state to false when the request is completed (success or failure)
    }
  };

  return (
    <div className={`flex ${isMobile ? "flex-col py-0" : "h-screen"} bg-white`}>
      <div
        className={`flex w-full ${isMobile ? "flex-col" : "flex-row"} h-full`}
      >
        {/* Left Side - OTP Form */}
        <div
          className={`flex ${
            isMobile ? "p-4 px-8" : "w-1/2 p-8 justify-center items-center"
          }`}
        >
          <div className="w-full max-w-md">
            <header className="flex items-center justify-start mb-10 gap-2">
              <img
                src={logoImage}
                alt="Logo"
                className="w-8 h-8 rounded-full"
              />
              <h1 className="text-3xl font-bold text-gray-600">Horizon</h1>
            </header>
            <h2
              className={`${
                isMobile ? "text-2xl font-normal mb-0" : "text-3xl mb-2"
              } font-bold text-start text-gray-800`}
            >
              Verify Email Address
            </h2>
            <p
              className={`text-start text-gray-600 ${
                isMobile ? "mb-10 text-sm" : "mb-8"
              }`}
            >
              Please enter the OTP sent to your email.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-600"
                >
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter 6-digit OTP"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying} // Disable button when verifying
                className={`w-full py-2 ${
                  isVerifying ? "bg-gray-400" : "bg-blue-600"
                } text-white rounded-md hover:bg-blue-700 focus:outline-none`}
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - Screenshot Image */}
        <div
          className={`hidden md:flex w-1/2 bg-gray-100 relative overflow-hidden`}
        >
          <div className="absolute h-4/5 w-auto right-[-50%] top-16 border-4 border-black overflow-hidden rounded-3xl">
            <img
              src={otpImage} // Path to your OTP-related image
              alt="OTP Screenshot"
              className="h-full object-cover"
            />
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default OTPVerification;
