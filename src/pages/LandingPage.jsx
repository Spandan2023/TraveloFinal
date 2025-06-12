import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-black text-white min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-xl w-full bg-gray-900 rounded-lg shadow-lg border border-gray-800 p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
          Welcome to <span className="text-blue-500">TravelApp</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8">
          Plan your perfect trip with AI-powered itinerary planning, hotel booking, weather forecasting, and travel blogs—all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition">
              Get Started
            </button>
          </Link>
          <Link to="/home">
            <button className="border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white font-semibold px-6 py-3 rounded-lg transition">
              Explore
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
