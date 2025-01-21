/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginImage from "../assets/screenshot.png"; // Ensure the path is correct
import { useAuth } from "../contexts/AuthContext";
import { isMobile } from "react-device-detect";
import logoImage from "../assets/logo.svg";

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/booking-dashboard", { state: { flagToast: true } });
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { email, password } = formData;
    if (!email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        formData,
        {
          headers: {
            "ngrok-skip-browser-warning": "69420", // Include this header
          },
        }
      );

      const { token, userId, isAdmin, message } = response.data;

      if (token) {
        toast.success("Login successful!");
        localStorage.setItem("token", token);
        localStorage.setItem("user", userId);

        if (isAdmin) {
          navigate("/admin-management", { state: { flagToast: true } });
        } else {
          navigate("/booking-dashboard", { state: { flagToastUser: true } });
        }
      } else {
        toast.error(message || "Login failed.");
      }
    } catch (error) {
      // Check if the error message indicates that the user is not verified
      if (error.response?.data?.message === "User is not verified") {
        try {
          // Sending the email for OTP verification
          const otpResponse = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/send-otp`,
            { email: formData.email }
          );

          // Check if the OTP response message is correct
          if (
            otpResponse.data.message ===
            "A new OTP has been sent to your email."
          ) {
            toast.success("OTP sent! Check your email.");
            // Redirect to OTP verification page
            navigate("/verify-otp", {
              state: {
                otpSent: true, // Indicate that OTP has been sent
                email: formData.email, // Pass email for OTP verification
                loginOtpRedirect: true, // Indicate this OTP verification is due to a login attempt
              },
            });
          } else {
            toast.error(otpResponse.data.message || "Failed to send OTP.");
          }
        } catch (otpError) {
          // Handle OTP send error
          toast.error(
            otpError.response?.data?.message ||
              "An error occurred while sending OTP."
          );
        }
      } else {
        // Handle any other errors (including general login failure)
        toast.error(error.response?.data?.message || "An error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex ${isMobile ? "flex-col py-0" : "h-screen"} bg-white`}>
      <div
        className={`flex w-full ${isMobile ? "flex-col" : "flex-row"} h-full`}
      >
        {/* Left Side - Form */}
        <div
          className={`flex ${
            isMobile ? "p-4 px-8" : "w-1/2 p-8 justify-center items-center"
          }`}
        >
          <div className="w-full max-w-md">
            {/* Header with Company Logo and Name */}
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
              Sign In
            </h2>
            <p
              className={`text-start text-gray-600 ${
                isMobile ? "mb-10 text-sm" : "mb-8"
              }`}
            >
              Log in to continue your journey.
            </p>
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-gray-400"
                    />
                  </span>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-10 px-4 py-3 rounded-lg shadow-sm border-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    placeholder="Enter your email"
                    aria-label="Enter your email"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-10 px-4 py-3 rounded-lg shadow-sm border-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    placeholder="Enter your password"
                    aria-label="Enter your password"
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="text-gray-400"
                    />
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>

              {/* Sign Up Link */}
              <p className="text-center mt-4 text-sm text-gray-600">
                Don’t have an account?{" "}
                <span
                  onClick={() => navigate("/signup")}
                  className="text-blue-500 hover:underline cursor-pointer font-medium"
                >
                  Sign up here
                </span>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side - Screenshot Image */}
        <div
          className={`hidden md:flex w-1/2 bg-gray-100 relative overflow-hidden`}
        >
          <div className="absolute h-4/5 w-auto right-[-50%] top-16 border-4 border-black overflow-hidden rounded-3xl">
            <img
              src={loginImage}
              alt="Website Screenshot"
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

export default Login;
