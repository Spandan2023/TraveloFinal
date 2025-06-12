import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 1245,
    bookings: 387,
    blogs: 92,
    revenue: 28450,
    pendingBlogs: 0
  });

  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [hotelForm, setHotelForm] = useState({
    name: '',
    location: '',
    pricePerNight: '',
    rating: '',
    amenities: '',
    image: null,
    available: true
  });

  useEffect(() => {
    fetchPendingBlogs();
  }, []);

  const fetchPendingBlogs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/blogs/pending');
      const pending = response.data;
      setPendingBlogs(pending);

      setStats(prev => ({
        ...prev,
        pendingBlogs: pending.length,
        blogs: prev.blogs + pending.filter(b => b.approved).length,
      }));
    } catch (error) {
      console.error('Error fetching pending blogs:', error);
    }
  };

  const approveBlog = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/blogs/approve/${id}`);
      setPendingBlogs(prev => prev.filter(blog => blog.id !== id));

      setStats(prev => ({
        ...prev,
        pendingBlogs: prev.pendingBlogs - 1,
        blogs: prev.blogs + 1
      }));
    } catch (error) {
      console.error('Error approving blog:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setHotelForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value
    }));
  };

  const handleHotelSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", hotelForm.name);
      formData.append("location", hotelForm.location);
      formData.append("pricePerNight", hotelForm.pricePerNight);
      formData.append("rating", hotelForm.rating);
      formData.append("amenities", hotelForm.amenities.trim());
      formData.append("available", hotelForm.available);
      formData.append("image", hotelForm.image);

      await axios.post('http://localhost:8080/api/hotels/add', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert('Hotel added successfully!');
      setHotelForm({
        name: '',
        location: '',
        pricePerNight: '',
        rating: '',
        amenities: '',
        image: null,
        available: true
      });
    } catch (error) {
      console.error('Error adding hotel:', error);
      alert('Failed to add hotel. Check console for details.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <p className="text-4xl font-bold text-center text-blue-400">
              {key === 'revenue' ? `$${value.toLocaleString()}` : value}
            </p>
            <p className="text-gray-400 mt-2 text-center capitalize">
              {key === 'pendingBlogs' ? 'Pending Blogs' : key.replace(/([A-Z])/g, ' $1')}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/users" className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-medium transition flex items-center justify-center">
            <span>Manage Users</span>
          </Link>
          <Link to="/admin/bookings" className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-medium transition flex items-center justify-center">
            <span>Manage Bookings</span>
          </Link>
          <Link to="/admin/blogs" className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-medium transition flex items-center justify-center">
            <span>Manage Blogs</span>
          </Link>
          <Link to="/admin/reports" className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-medium transition flex items-center justify-center">
            <span>View Reports</span>
          </Link>
        </div>
      </div>

      {/* Add Hotel Form */}
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-10">
        <h2 className="text-2xl font-semibold mb-4">Add New Hotel</h2>
        <form onSubmit={handleHotelSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" name="name" value={hotelForm.name} onChange={handleFormChange} placeholder="Hotel Name" className="p-2 rounded bg-gray-900 border border-gray-700 text-white" required />
          <input type="text" name="location" value={hotelForm.location} onChange={handleFormChange} placeholder="Location" className="p-2 rounded bg-gray-900 border border-gray-700 text-white" required />
          <input type="number" name="pricePerNight" value={hotelForm.pricePerNight} onChange={handleFormChange} placeholder="Price Per Night" className="p-2 rounded bg-gray-900 border border-gray-700 text-white" required />
          <input type="number" step="0.1" name="rating" value={hotelForm.rating} onChange={handleFormChange} placeholder="Rating (out of 5)" className="p-2 rounded bg-gray-900 border border-gray-700 text-white" required />
          <input type="text" name="amenities" value={hotelForm.amenities} onChange={handleFormChange} placeholder="Amenities (comma-separated)" className="p-2 rounded bg-gray-900 border border-gray-700 text-white" required />
          
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFormChange}
            className="p-2 rounded bg-gray-900 border border-gray-700 text-white"
            required
          />
          
          <label className="flex items-center space-x-2 col-span-2">
            <input type="checkbox" name="available" checked={hotelForm.available} onChange={handleFormChange} className="form-checkbox text-blue-600" />
            <span>Available</span>
          </label>
          <button type="submit" className="col-span-2 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded font-semibold">
            Add Hotel
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 max-h-[300px] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {[
              'New user registered: traveler123',
              'Booking #4582 confirmed for Paris trip',
              'Blog "Top 10 Beaches" submitted for review',
              'Payment of $450 received for hotel booking'
            ].map((activity, index) => (
              <div key={index} className="flex items-start pb-3 border-b border-gray-700">
                <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 mr-3"></div>
                <p className="text-gray-300">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 max-h-[300px] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Pending Approvals</h3>
          {pendingBlogs.length > 0 ? (
            <div className="space-y-4">
              {pendingBlogs.map(blog => (
                <div key={blog.id} className="border border-yellow-600 rounded p-4 bg-gray-900">
                  <h4 className="text-lg font-semibold mb-2">{blog.title}</h4>
                  <p className="text-gray-400 mb-2">By {blog.author} ({blog.email})</p>
                  <p className="text-gray-300 mb-4 line-clamp-3">{blog.content}</p>
                  <button
                    onClick={() => approveBlog(blog.id)}
                    className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded font-medium transition"
                  >
                    Approve
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No pending approvals</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
