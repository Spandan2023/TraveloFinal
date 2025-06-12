import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="bg-black text-white min-h-screen px-6 py-12 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-gray-900 rounded-lg shadow-xl border border-gray-800 p-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white">
          Explore the world with <span className="text-blue-500">TravelApp</span>
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Plan your trips, book hotels, check weather forecasts, and stay updated with the latest travel blogs.
          Everything you need for your perfect journey — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/planner"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition text-center"
          >
            Start Planning
          </Link>
          <Link
            to="/blogs"
            className="border border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition text-center"
          >
            Read Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
