/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.jsx"; // Import the context
import axios from "axios"; // You can use axios or fetch for the request

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(""); // This will hold the username fetched from the backend
  const [userID, setUserID] = useState(""); // Store userID from localStorage

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem("token");
      const storedUserID = localStorage.getItem("user"); // Fetch the userID (MongoDB ID)

      if (token && storedUserID) {
        setIsLoggedIn(true);
        setUserID(storedUserID);

        try {
          // Send a request to the backend to fetch the username using the userID
          const response = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/auth/getUserById/${storedUserID}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setUsername(response.data.name); // Assuming the response contains a 'username'
        } catch (error) {
          console.error("Error fetching user data:", error);
          setIsLoggedIn(false);
          setUsername("");

          if (error.response.data.message == "Invalid or expired token") {
            // Remove specific items
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("bookedTicket");
          }
        }
      } else {
        setIsLoggedIn(false);
        setUsername("");
      }
    };

    // Check authentication status when the component mounts
    checkAuthStatus();

    // Set up an interval to check every 1000ms (1 second) for changes
    const interval = setInterval(checkAuthStatus, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures this runs only on mount/unmount

  const login = (user) => {
    localStorage.setItem("token", user.token);
    localStorage.setItem("userID", user.userID); // Save the userID (MongoDB ID)
    setIsLoggedIn(true);
    setUserID(user.userID);

    // Fetch the username after login
    axios
      .get(`/api/user/${user.userID}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((response) => {
        setUsername(response.data.username); // Assuming the response contains a 'username'
      })
      .catch((error) => {
        console.error("Error fetching user data on login:", error);
        setUsername(""); // Reset username on error
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    setIsLoggedIn(false);
    setUsername("");
    setUserID("");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, username, userID, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
