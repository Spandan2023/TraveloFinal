import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserDetails from './UserDetails';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    username: '',
    email: '',
    phone: 'Not provided',
    address: 'Not provided',
  });

  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await axios.post('http://localhost:8080/users/login', {
          email: currentUser.email,
          password: currentUser.password,
        });

        const fetchedUser = res.data.user;
        setUserData({
          username: fetchedUser.username,
          email: fetchedUser.email,
          phone: fetchedUser.phone || 'Not provided',
          address: fetchedUser.address || 'Not provided',
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserDetails();

    setTimeout(() => {
      setSavedBlogs([
        {
          id: 2,
          title: "How to Pack Light for a Long Trip",
          excerpt: "Tips and tricks on packing efficiently...",
          date: "April 30, 2025"
        }
      ]);

      setUpcomingTrips([
        {
          id: 'BKG-123456',
          destination: 'Paris, France',
          hotel: 'Grand Royal Hotel',
          checkIn: '2025-06-15',
          checkOut: '2025-06-20',
          status: 'Confirmed'
        }
      ]);

      setLoading(false);
    }, 800);
  }, [currentUser]);

  const handleUserUpdate = (updatedData) => {
    setUserData(updatedData);
  };

  const removeSavedBlog = (blogId) => {
    setSavedBlogs(savedBlogs.filter(blog => blog.id !== blogId));
  };

  const cancelTrip = (tripId) => {
    setUpcomingTrips(upcomingTrips.filter(trip => trip.id !== tripId));
  };

  const handleBlogSubmit = async () => {
    if (!blogTitle || !blogContent) {
      setSubmissionMessage("Please fill out both title and content.");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/blogs/submit', {
        title: blogTitle,
        content: blogContent,
        authorEmail: userData.email,
        authorName: userData.username,
      });

      setSubmissionMessage("✅ Blog submitted for admin approval!");
      setBlogTitle('');
      setBlogContent('');
    } catch (err) {
      console.error('Blog submission error:', err);
      setSubmissionMessage("❌ Error submitting blog.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      <h1 className="text-3xl font-bold mb-2 text-white">
        Welcome back, {userData.username || "Traveler"}!
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/planner" className="block bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-medium transition text-center">
                Plan a New Trip
              </Link>
              <Link to="/hotels" className="block bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-medium transition text-center">
                Book a Hotel
              </Link>
              <Link to="/blogs" className="block bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-medium transition text-center">
                Read Travel Blogs
              </Link>
            </div>
          </div>

          {/* Profile Details */}
          <UserDetails initialUser={userData} onSave={handleUserUpdate} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* ✍️ Blog Submission */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Write a Travel Blog</h2>
            <input
              type="text"
              placeholder="Blog Title"
              className="w-full px-3 py-2 mb-4 rounded bg-gray-700 text-white border border-gray-600"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
            <div className="bg-white text-black rounded mb-4">
              <ReactQuill
                value={blogContent}
                onChange={setBlogContent}
                theme="snow"
              />
            </div>
            <button
              onClick={handleBlogSubmit}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-medium transition text-white"
            >
              Submit Blog
            </button>
            {submissionMessage && (
              <p className="mt-2 text-sm text-gray-300">{submissionMessage}</p>
            )}
          </div>

          {/* Upcoming Trips */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Upcoming Trips</h2>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : upcomingTrips.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You don't have any upcoming trips.</p>
                <Link to="/hotels" className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition">
                  Book a Trip
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingTrips.map(trip => (
                  <div key={trip.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{trip.destination}</h3>
                        <p className="text-gray-400 text-sm">{trip.hotel}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded ${trip.status === 'Confirmed' ? 'bg-green-600' : 'bg-yellow-600'
                          }`}
                      >
                        {trip.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <p className="text-gray-400">Check-in</p>
                        <p>{new Date(trip.checkIn).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Check-out</p>
                        <p>{new Date(trip.checkOut).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-3 space-x-2">
                      <Link
                        to={`/payment?booking=${trip.id}`}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => cancelTrip(trip.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}

              </div>
            )}
          </div>

          {/* Saved Blogs */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-white">Saved Blogs</h2>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : savedBlogs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">You haven't saved any blogs yet.</p>
                <Link to="/blogs" className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition">
                  Explore Blogs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedBlogs.map(blog => (
                  <div key={blog.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                    <h3 className="font-bold mb-1">{blog.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{blog.date}</p>
                    <p className="text-gray-300 text-sm line-clamp-2">{blog.excerpt}</p>
                    <div className="flex justify-end mt-3 space-x-3">
                      <Link to={`/blogs/${blog.id}`} className="text-blue-400 hover:text-blue-300 text-sm">
                        Read
                      </Link>

                      <button onClick={() => removeSavedBlog(blog.id)} className="text-gray-400 hover:text-red-300 text-sm">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;