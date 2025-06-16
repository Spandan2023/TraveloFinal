import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';

const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [savedBlogs, setSavedBlogs] = useState([]);
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    contact_number: '',
    address: '',
    password: '',
    originalPassword: ''
  });
  const [message, setMessage] = useState("");

  const [blogTitle, setBlogTitle] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [penName, setPenName] = useState('');

  useEffect(() => {
    if (currentUser && currentUser.email) {
      axios.get(`http://localhost:8080/users/profile?email=${currentUser.email}`)
        .then(res => {
          setUserData({
            ...res.data,
            password: '',
            originalPassword: res.data.password || '',
          });
          setEditMode(true);
          setMessage('');
        })
        .catch(err => {
          console.error('Failed to fetch profile:', err);
          setMessage('Error fetching user profile.');
        });

      // Dummy trips/blogs for UI
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
    }
  }, [currentUser]);

  const handleProfileSave = async () => {
    if (userData.password && userData.password === userData.originalPassword) {
      setMessage("New password must be different from current password.");
      return;
    }

    try {
      await axios.put('http://localhost:8080/users/update', userData);
      setEditMode(false);
      setMessage("Profile updated successfully.");
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage("Error updating profile.");
    }
  };

  const handleBlogSubmit = async () => {
    if (!blogTitle || !blogContent || !penName) {
      setSubmissionMessage("Please fill out title, content, and pen name.");
      return;
    }
    try {
      await axios.post('http://localhost:8080/api/blogs/submit', {
        name: penName,
        title: blogTitle,
        blogs: blogContent,
      });
      setSubmissionMessage("✅ Blog submitted for admin approval!");
      setBlogTitle('');
      setBlogContent('');
      setPenName('');
    } catch (err) {
      console.error('Blog submission error:', err);
      setSubmissionMessage("❌ Error submitting blog.");
    }
  };

  const cancelTrip = (tripId) => {
    setUpcomingTrips(upcomingTrips.filter(trip => trip.id !== tripId));
  };

  const removeSavedBlog = (id) => {
    setSavedBlogs(savedBlogs.filter(blog => blog.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-indigo-900 to-purple-700 text-white font-sans p-6">
      <h1 className="text-4xl font-extrabold mb-10 text-center">Welcome back, {userData.name || "Traveler"}!</h1>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* LEFT SECTION */}
        <div className="space-y-6 col-span-1">
          {/* PROFILE */}
          <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Update Profile Details</h2>
            <input
              className="w-full mb-2 p-2 rounded text-gray-500 bg-gray-800 cursor-not-allowed"
              value={userData.email}
              disabled
            />
            <input
              className="w-full mb-2 p-2 rounded text-black"
              placeholder="Name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 rounded text-black"
              placeholder="Phone"
              value={userData.contact_number || ''}
              onChange={(e) => setUserData({ ...userData, contact_number: e.target.value })}
            />
            <input
              className="w-full mb-2 p-2 rounded text-black"
              placeholder="Address"
              value={userData.address || ''}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            />
            <input
              className="w-full mb-4 p-2 rounded text-black"
              placeholder="New Password"
              type="password"
              value={userData.password}
              onChange={(e) => setUserData({ ...userData, password: e.target.value })}
            />
            <div className="flex justify-between">
              <button
                className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-2 rounded"
                onClick={() => {
                  setEditMode(false);
                  setUserData({
                    name: '',
                    email: '',
                    contact_number: '',
                    address: '',
                    password: '',
                    originalPassword: ''
                  });
                  setMessage('');
                }}
              >
                Cancel
              </button>
              <button
                className="bg-gradient-to-r from-green-400 to-blue-500 px-4 py-2 rounded"
                onClick={handleProfileSave}
              >
                Save
              </button>
            </div>
            {message && <p className="mt-2 text-white italic">{message}</p>}
          </div>

          {/* QUICK ACTIONS */}
          <div className="bg-gray-900/50 backdrop-blur-md p-6 rounded-2xl border border-gray-700">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link to="/planner" className="block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 px-4 py-3 rounded-xl font-semibold text-center">
                Plan a New Trip
              </Link>
              <Link to="/hotels" className="block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 px-4 py-3 rounded-xl font-semibold text-center">
                Book a Hotel
              </Link>
              <Link to="/blogs" className="block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 px-4 py-3 rounded-xl font-semibold text-center">
                Read Travel Blogs
              </Link>
            </div>
          </div>

          {/* SAVED BLOGS */}
          <div className="bg-orange-400/10 border border-orange-500 p-6 rounded-2xl backdrop-blur-md">
            <h2 className="text-xl font-semibold mb-4">Saved Blogs</h2>
            {loading ? (
              <p>Loading...</p>
            ) : savedBlogs.length === 0 ? (
              <p>No saved blogs.</p>
            ) : (
              savedBlogs.map(blog => (
                <div key={blog.id} className="mb-4">
                  <h3 className="font-bold text-lg">{blog.title}</h3>
                  <p className="text-sm text-gray-300 italic">{blog.date}</p>
                  <p className="text-sm mt-2">{blog.excerpt}</p>
                  <div className="flex justify-end gap-4 mt-2">
                    <Link to={`/blogs/${blog.id}`} className="text-blue-300 underline">Read</Link>
                    <button onClick={() => removeSavedBlog(blog.id)} className="text-red-400 hover:text-red-300">Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="col-span-3 space-y-6">
          {/* BLOG SUBMIT */}
          <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-gray-700">
            <h2 className="text-2xl font-semibold mb-4">Write a Travel Blog</h2>
            <input
              type="text"
              placeholder="Blog Title"
              className="w-full px-4 py-2 mb-4 rounded bg-gray-800 text-white placeholder-white border border-gray-600"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
            />
            <div className="bg-white text-black rounded mb-4">
              <ReactQuill value={blogContent} onChange={setBlogContent} theme="snow" />
            </div>
            <input
              type="text"
              placeholder="Writer Name"
              className="w-full px-4 py-2 mb-4 rounded bg-gray-800 text-white placeholder-white border border-gray-600"
              value={penName}
              onChange={(e) => setPenName(e.target.value)}
            />
            <button
              onClick={handleBlogSubmit}
              className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 px-6 py-3 rounded-xl font-semibold"
            >
              Submit Blog
            </button>
            {submissionMessage && (
              <p className="mt-2 text-sm text-white italic">{submissionMessage}</p>
            )}
          </div>

          {/* UPCOMING TRIPS */}
          <div className="bg-red-400/10 border border-red-500 backdrop-blur-md p-6 rounded-2xl">
            <h2 className="text-xl font-semibold mb-4">Upcoming Trips</h2>
            {loading ? (
              <p>Loading...</p>
            ) : upcomingTrips.length === 0 ? (
              <p>No upcoming trips.</p>
            ) : (
              upcomingTrips.map(trip => (
                <div key={trip.id} className="bg-gray-800 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{trip.destination}</h3>
                      <p className="text-sm italic">{trip.hotel}</p>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${trip.status === 'Confirmed' ? 'bg-green-600' : 'bg-yellow-600'}`}>{trip.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <p className="text-gray-400">Check-in</p>
                      <p className="font-[Times New Roman]">{new Date(trip.checkIn).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Check-out</p>
                      <p className="font-[Times New Roman]">{new Date(trip.checkOut).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3 space-x-3">
                    <Link to={`/payment?booking=${trip.id}`} className="text-blue-400 underline">View Details</Link>
                    <button onClick={() => cancelTrip(trip.id)} className="text-red-400 hover:text-red-300">Cancel</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
