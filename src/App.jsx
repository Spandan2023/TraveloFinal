import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginSignup from './pages/LoginSignup';
import Homepage from './pages/HomePage';
import BlogsPage from './pages/BlogsPage';
import ItineraryPlanner from './pages/ItineraryPlanner';
import WeatherForecasting from './pages/WeatherForecasting';
import UserDashboard from './pages/UserDashboard';
import UserDetails from './pages/UserDetails';
import HotelBooking from './pages/HotelBooking';
import PaymentGateway from './pages/PaymentGateway';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App = () => (
  <AuthProvider>
    <Router>
      <div className="bg-gray-900 text-gray-100 min-h-screen font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginSignup />} />
            
              <Route path="/home" element={<Homepage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/planner" element={<ItineraryPlanner />} />
              <Route path="/weather" element={<WeatherForecasting />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/details" element={<UserDetails />} />
              <Route path="/hotels" element={<HotelBooking />} />
              <Route path="/payment" element={<PaymentGateway />} />
              <Route path="/admin" element={<AdminDashboard />} />
     
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  </AuthProvider>
);

export default App;