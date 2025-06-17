import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlaneDeparture, FaBlog } from 'react-icons/fa';

const Homepage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-purple-100">
{/* 🌈 Glass Crystal Rainbow Layers */}
<div
  className="absolute inset-0 z-[-2] opacity-10/9+0"
  style={{
    background: `
      radial-gradient(circle at 15% 20%, rgba(255, 0, 0, 0.25), transparent 40%),
      radial-gradient(circle at 85% 30%, rgba(255, 165, 0, 0.25), transparent 40%),
      radial-gradient(circle at 20% 80%, rgba(255, 255, 0, 0.25), transparent 40%),
      radial-gradient(circle at 50% 50%, rgba(0, 128, 0, 0.25), transparent 45%),
      radial-gradient(circle at 75% 85%, rgba(0, 0, 255, 0.25), transparent 45%),
      radial-gradient(circle at 90% 10%, rgba(75, 0, 130, 0.25), transparent 45%),
      radial-gradient(circle at 50% 20%, rgba(238, 130, 238, 0.25), transparent 40%),
      linear-gradient(to bottom right, rgba(255,255,255,0.05), rgba(0,0,0,0.05))
    `
  }}
/>

{/* 🌫️ Extra mist for dreaminess */}
<div className="absolute inset-0 bg-white/5 backdrop-blur-2xl z-[-1]" />

      {/* 💎 Foreground Glass Card */}
      <div className="relative z-10 bg-black text-white rounded-3xl shadow-2xl border border-white/30 p-10 max-w-4xl w-full text-center backdrop-blur-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 font-[Outfit] text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">
          Explore the world with Travelo
        </h1>
        <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-light">
          ✈️ Plan trips, book hotels, check weather forecasts, and dive into stories from wanderers like you.
          Everything for the perfect journey — in one spot.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/planner"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition shadow-md"
          >
            <FaPlaneDeparture />
            Start Planning
          </Link>

          <Link
            to="/blogs"
            className="flex items-center justify-center gap-2 border border-purple-400 text-purple-200 hover:bg-purple-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition shadow-md"
          >
            <FaBlog />
            Read Blogs
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
