import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const navItemStyle =
    "block px-4 py-2 text-white hover:text-blue-300 transition duration-300";

  const NavLinks = () => (
    <>
      <Link to="/home" className={navItemStyle} onClick={closeSidebar}>
        Home
      </Link>
      <Link to="/blogs" className={navItemStyle} onClick={closeSidebar}>
        Blogs
      </Link>
      <Link to="/planner" className={navItemStyle} onClick={closeSidebar}>
        Planner
      </Link>
      <Link to="/hotels" className={navItemStyle} onClick={closeSidebar}>
        Hotels
      </Link>
      <Link to="/weather" className={navItemStyle} onClick={closeSidebar}>
        Weather
      </Link>
      <Link to="/dashboard" className={navItemStyle} onClick={closeSidebar}>
        Profile
      </Link>
      <button
        onClick={() => {
          logout();
          closeSidebar();
        }}
        className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 transition"
      >
        Logout
      </button>
    </>
  );

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-800 px-6 py-4 shadow-md border-b border-blue-600">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link
            to="/home"
            className="flex items-center space-x-3 text-white font-extrabold text-2xl tracking-wide"
          >
            <img
              src="/logo.png"
              alt="TravelApp Logo"
              className="w-10 h-10 rounded-full border-2 border-white shadow-md"
            />
            <span>TravelApp</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {currentUser ? (
              <NavLinks />
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={closeSidebar}
          />
          <div className="relative bg-gray-900 w-64 h-full shadow-2xl z-50">
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
