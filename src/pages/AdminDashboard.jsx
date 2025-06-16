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
    setPendingBlogs(response.data);
    setStats(prev => ({
      ...prev,
      pendingBlogs: response.data.length
    }));
  } catch (error) {
    console.error("Error fetching pending blogs:", error);
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
    console.error("Error approving blog:", error);
  }
};

const rejectBlog = async (id) => {
  try {
    await axios.delete(`http://localhost:8080/api/blogs/reject/${id}`);
    setPendingBlogs(prev => prev.filter(blog => blog.id !== id));
    setStats(prev => ({
      ...prev,
      pendingBlogs: prev.pendingBlogs - 1
    }));
  } catch (error) {
    console.error("Error rejecting blog:", error);
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
    <div className="min-h-screen bg-gradient-to-br from-white via-lavender to-red-100 text-black font-sans px-4 py-10">
      <h1 className="text-4xl font-extrabold text-center mb-10 drop-shadow-lg">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="backdrop-blur-sm bg-white/40 border border-gray-300 rounded-2xl p-6 shadow-xl">
            <p className="text-4xl text-center font-bold text-black font-[Times New Roman]">
              {key === 'revenue' ? `$${value.toLocaleString()}` : value}
            </p>
            <p className="text-center text-md mt-2 capitalize text-gray-700">
              {key === 'pendingBlogs' ? 'Pending Blogs' : key.replace(/([A-Z])/g, ' $1')}
            </p>
          </div>
        ))}
      </div>

      <div className="backdrop-blur-sm bg-white/40 border border-gray-300 rounded-2xl p-6 shadow-xl mb-10">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {['users', 'bookings', 'blogs', 'reports'].map((action) => (
            <Link
              key={action}
              to={`/admin/${action}`}
              className="py-3 rounded-xl font-semibold text-white text-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 transition"
            >
              Manage {action.charAt(0).toUpperCase() + action.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      <div className="backdrop-blur-sm bg-white/40 border border-gray-300 rounded-2xl p-6 shadow-xl mb-10">
        <h2 className="text-2xl font-bold mb-4">Add New Hotel</h2>
        <form onSubmit={handleHotelSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['name', 'location', 'pricePerNight', 'rating', 'amenities'].map((field, i) => (
            <input
              key={i}
              type={field === 'pricePerNight' || field === 'rating' ? 'number' : 'text'}
              name={field}
              value={hotelForm[field]}
              onChange={handleFormChange}
              placeholder={field.replace(/([A-Z])/g, ' $1')}
              className="p-3 rounded-lg bg-gray-300 text-black placeholder-white border border-gray-300 focus:ring"
              required
            />
          ))}
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFormChange}
            className="p-3 rounded-lg bg-gray-100 text-black border border-gray-300"
            required
          />
          <label className="flex items-center space-x-3 col-span-2">
            <input
              type="checkbox"
              name="available"
              checked={hotelForm.available}
              onChange={handleFormChange}
              className="w-6 h-6 rounded text-purple-600 border-gray-300"
            />
            <span className="text-black">Available</span>
          </label>
          <button
            type="submit"
            className="col-span-2 bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 rounded-lg font-semibold hover:from-blue-500 hover:to-green-400"
          >
            Add Hotel
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="backdrop-blur-sm bg-white/40 border border-gray-300 rounded-2xl p-6 shadow-xl max-h-[300px] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {["New user registered: traveler123", "Booking #4582 confirmed for Paris trip", "Blog 'Top 10 Beaches' submitted for review", "Payment of $450 received for hotel booking"].map((activity, index) => (
              <div key={index} className="flex items-start pb-3 border-b border-gray-200">
                <div className="bg-blue-500 rounded-full w-2 h-2 mt-2 mr-3"></div>
                <p className="text-black">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="backdrop-blur-sm bg-white/40 border border-gray-300 rounded-2xl p-6 shadow-xl max-h-[300px] overflow-y-auto">
          <h3 className="text-xl font-bold mb-4">Pending Approvals</h3>
          {pendingBlogs.length > 0 ? (
            <div className="space-y-4">
              {pendingBlogs.map(blog => (
  <div key={blog.id} className="border border-yellow-500 rounded-xl p-4 bg-white/70">
    <h4 className="text-lg font-semibold text-black mb-1">{blog.title}</h4>
    <p className="text-sm text-gray-800 mb-1">By {blog.name}</p>
    <div
  className="text-gray-700 mb-3 line-clamp-3"
  dangerouslySetInnerHTML={{ __html: blog.blogs }}
></div>

    <div className="flex gap-3">
  <button
    onClick={() => approveBlog(blog.id)}
    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-md font-semibold hover:from-orange-500 hover:to-yellow-400"
  >
    Approve
  </button>

  <button
    onClick={() => rejectBlog(blog.id)}
    className="bg-gradient-to-r from-red-500 via-pink-600 to-red-700 text-white px-4 py-2 rounded-md font-semibold hover:from-pink-700 hover:to-red-600"
  >
    Reject
  </button>
</div>

  </div>
))}

            </div>
          ) : (
            <p className="text-gray-700">No pending approvals</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;