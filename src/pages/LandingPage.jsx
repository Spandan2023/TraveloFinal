import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="relative bg-black text-white min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden">

      {/* 🌈 Rainbow Crystal Background Layers */}
      <div
        className="absolute inset-0 z-[-2] opacity-80"
        style={{
          background: `
            radial-gradient(circle at 15% 20%, rgba(255, 0, 0, 0.25), transparent 40%),
            radial-gradient(circle at 85% 30%, rgba(255, 165, 0, 0.25), transparent 40%),
            radial-gradient(circle at 20% 80%, rgba(255, 255, 0, 0.25), transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(0, 128, 0, 0.25), transparent 45%),
            radial-gradient(circle at 75% 85%, rgba(0, 0, 255, 0.25), transparent 45%),
            radial-gradient(circle at 90% 10%, rgba(75, 0, 130, 0.25), transparent 45%),
            radial-gradient(circle at 50% 20%, rgba(238, 130, 238, 0.25), transparent 40%),
            linear-gradient(to bottom right, rgba(255,255,255,0.03), rgba(0,0,0,0.03))
          `
        }}
      />
      <div className="absolute inset-0 bg-white/10 backdrop-blur-2xl z-[-1]" />

      {/* 💎 Glass Card */}
      <div className="z-10 max-w-xl w-full bg-white/10 backdrop-blur-lg border border-white/30 shadow-xl rounded-3xl px-10 py-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-5 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-pink-500">
          Welcome to TravelApp
        </h1>
        <p className="text-gray-200 text-lg md:text-xl mb-10 font-light">
          Plan your perfect trip with AI-powered itinerary planning, hotel booking, weather forecasting, and travel blogs — all in one place.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all hover:scale-105">
              Get Started
            </button>
          </Link>
          <Link to="/home">
            <button className="bg-white/10 border border-purple-400 text-purple-200 hover:bg-purple-600 hover:text-white font-semibold px-6 py-3 rounded-xl shadow-md transition-all hover:scale-105">
              Explore
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
