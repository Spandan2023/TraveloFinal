import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-6 px-6">
      <div className="max-w-7xl mx-auto text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} TravelApp. All rights reserved.</p>
        <p className="mt-2">Explore the world with our travel planning tools and resources.</p>
      </div>
    </footer>
  );
};

export default Footer;