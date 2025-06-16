import React from 'react';
import { FaInstagram, FaTwitter, FaFacebookF } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-black border-t border-gray-700 py-8 px-6 text-gray-300">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-lg font-semibold tracking-wide mb-2">
          TravelApp – Make Every Journey Memorable ✈️
        </h2>
        <p className="text-sm mb-4">
          &copy; {new Date().getFullYear()} TravelApp. All rights reserved.
        </p>

        <p className="text-sm mb-4">
          Explore the world with our all-in-one planning tools, blogs, and real-time updates.
        </p>

        <div className="flex justify-center gap-4 text-white text-lg">
          <a href="#" className="hover:text-blue-400 transition">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            <FaTwitter />
          </a>
          <a href="#" className="hover:text-blue-400 transition">
            <FaFacebookF />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
