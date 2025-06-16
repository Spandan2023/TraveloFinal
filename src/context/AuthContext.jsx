// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
export const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage if available
  useEffect(() => {
    const storedUser = localStorage.getItem('travelAppUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login: Save to both state and localStorage
  const login = (userData) => {
    if (userData && userData.email) {
      setCurrentUser(userData);
      localStorage.setItem('travelAppUser', JSON.stringify(userData));
    } else {
      console.error("Login failed: No user email provided.");
    }
  };

  // Logout: Clear state and localStorage
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('travelAppUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth easily
export const useAuth = () => useContext(AuthContext);
