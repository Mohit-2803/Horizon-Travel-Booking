/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Import the Sidebar component
import Trains from "./Trains"; // Import the Trains component
import Revenue from "./Revenue"; // New component for revenue section
import Queries from "./Queries"; // New component for queries section
import Buses from "./Buses"; // New component for buses section
import Flights from "./Flights"; // New component for flights section
import Comments from "./Comments"; // New component for comments section
import { toast, ToastContainer } from "react-toastify";

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState("trains"); // Default section is trains
  const navigate = useNavigate();
  const location = useLocation();

  // Function to check token validity
  const checkToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // Redirect to login if no token
      navigate("/login");
      return;
    }
  };

  // Check token when the component mounts
  useEffect(() => {
    checkToken();

    if (location.state?.flagToast) {
      // toast.success("You are logged-In as ADMIN");
      window.history.replaceState({}, "");
    }
  }, [checkToken]);

  // Function to handle sidebar navigation
  const handleSidebarClick = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <ToastContainer />
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onClick={handleSidebarClick} />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-gray-50">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-700 to-blue-500 text-white py-4">
          <h1 className="text-center text-3xl font-bold">Admin Dashboard</h1>
        </header>

        {/* Conditional Rendering Based on Active Section */}
        <main className="mt-6">
          {activeSection === "trains" && <Trains />}
          {activeSection === "revenue" && <Revenue />}
          {activeSection === "queries" && <Queries />}
          {activeSection === "buses" && <Buses />}
          {activeSection === "flights" && <Flights />}
          {activeSection === "comments" && <Comments />}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
