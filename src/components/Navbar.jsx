import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const NavLinks = () => (
    <>
      <Link
        to="/home"
        className="block px-4 py-2 text-gray-300 hover:text-white"
        onClick={closeSidebar}
      >
        Home
      </Link>
      <Link
        to="/blogs"
        className="block px-4 py-2 text-gray-300 hover:text-white"
        onClick={closeSidebar}
      >
        Blogs
      </Link>
      <Link
        to="/planner"
        className="block px-4 py-2 text-gray-300 hover:text-white"
        onClick={closeSidebar}
      >
        Planner
      </Link>
      <Link
        to="/weather"
        className="block px-4 py-2 text-gray-300 hover:text-white"
        onClick={closeSidebar}
      >
        Weather
      </Link>
      <Link
        to="/dashboard"
        className="block px-4 py-2 text-gray-300 hover:text-white"
        onClick={closeSidebar}
      >
        Profile
      </Link>
      <button
        onClick={() => {
          logout();
          closeSidebar();
        }}
        className="block w-full text-left px-4 py-2 text-red-500 hover:text-red-400"
      >
        Logout
      </button>
    </>
  );

  return (
    <>
      {/* Navbar */}
      <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/home"
            className="flex items-center space-x-3 text-white font-bold text-3xl"
          >
            <img
              src="/logo.png"
              alt="TravelApp Logo"
              className="w-12 h-12 object-contain"
            />
            <span>TravelApp</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <NavLinks />
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm font-medium transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleSidebar}
          >
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeSidebar}
          />

          {/* Sidebar */}
          <div className="relative bg-gray-900 w-64 h-full shadow-lg z-50">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-white text-xl font-semibold">Menu</h2>
              <button onClick={closeSidebar}>
                <X className="text-white" />
              </button>
            </div>
            <nav className="flex flex-col py-4">
              {currentUser ? (
                <NavLinks />
              ) : (
                <Link
                  to="/login"
                  onClick={closeSidebar}
                  className="block px-4 py-2 text-blue-500 hover:text-blue-400"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
