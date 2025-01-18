// src/contexts/AuthContext.jsx

import { createContext, useContext } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Create a custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext); // Using useContext to access the AuthContext value
};
