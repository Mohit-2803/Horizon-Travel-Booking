/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import screenshotImage from "../assets/screenshot.png"; // Update the path to your website screenshot image
import logoImage from "../assets/logo.svg";
import { useAuth } from "../contexts/AuthContext";
import { isMobile } from "react-device-detect";

const Signup = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/booking-dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const { username, email, password, confirmPassword } = formData;
    if (!username.trim()) {
      toast.error("Username is required.");
      return false;
    }
    if (username.length < 5) {
      toast.error("Username must be at least 5 characters long.");
      return false;
    }
    if (!email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Invalid email address.");
      return false;
    }
    if (!password) {
      toast.error("Password is required.");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
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
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
        formData
      );
      if (
        response.data.message ===
        "Signup initiated. OTP sent to your email. Please verify the OTP."
      ) {
        toast.success("OTP has been sent. Please verify.");
        navigate("/verify-otp", {
          state: { otpSent: true, email: formData.email },
        });
      } else {
        toast.error(response.data.message || "Signup failed.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
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
              Sign Up
            </h2>
            <p
              className={`text-start text-gray-600 ${
                isMobile ? "mb-10 text-sm" : "mb-8"
              }`}
            >
              Join us and start booking your next adventure effortlessly.
            </p>
            <form onSubmit={handleSubmit}>
              {/* Username */}
              <div className="mb-4">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-10 px-4 py-3 rounded-lg shadow-sm border-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    placeholder="Enter your username"
                    aria-label="Enter your username"
                  />
                </div>
              </div>

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

              {/* Confirm Password */}
              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                  </span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full pl-10 px-4 py-3 rounded-lg shadow-sm border-[2px] focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                    placeholder="Confirm your password"
                    aria-label="Confirm your password"
                  />
                  <span
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    aria-label="Toggle confirm password visibility"
                  >
                    <FontAwesomeIcon
                      icon={showConfirmPassword ? faEyeSlash : faEye}
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
                {isLoading ? "Signing Up..." : "Sign Up"}
              </button>

              {/* Login Link */}
              <p className="text-center mt-4 text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/login")}
                  className="text-blue-500 hover:underline cursor-pointer font-medium"
                >
                  Log in here
                </span>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side - Screenshot Image */}
        <div
          className={`hidden md:flex w-1/2 bg-gray-100 relative overflow-hidden`} // Prevents overflow
        >
          <div className="absolute h-4/5 w-auto right-[-50%] top-16 border-4 border-black overflow-hidden rounded-3xl">
            <img
              src={screenshotImage}
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

export default Signup;
