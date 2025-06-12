import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    contactNumber: '',
    address: '',
  });

  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const storedUsers = localStorage.getItem('travelappUsers');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('travelappUsers', JSON.stringify(users));
  }, [users]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      username: '',
      email: '',
      password: '',
      contactNumber: '',
      address: '',
    });
    setError('');
    setSuccessMessage('');
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const { username, email, password, contactNumber, address } = formData;

    if (!email || !password || (!isLogin && !username)) {
      setError('Please fill all required fields.');
      return;
    }

    setLoading(true);

    setTimeout(async () => {
      if (isLogin) {
        try {
          const adminRes = await axios.post('http://localhost:8080/user/admin/login', {
            email,
            password
          });
          if (adminRes.data.status === 'success') {
            setSuccessMessage('Welcome Admin!');
            login({ email, role: 'admin' });
            navigate('/admin');
            return;
          }
        } catch (adminErr) {
          // fallback to user login
        }

        try {
          const response = await axios.post('http://localhost:8080/users/login', {
            email,
            password,
          });
          const userData = response.data.user;
          login(userData);
          setSuccessMessage(`Welcome back, ${userData.name || userData.username || 'User'}!`);
          navigate('/home');
        } catch (err) {
          if (err.response && err.response.status === 401) {
            setError('Invalid email or password.');
          } else {
            setError('Login failed. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      } else {
        // Signup
        try {
          await axios.post('http://localhost:8080/users/register', {
            name: username,
            email,
            password,
            contactNumber,
            address
          });
          setSuccessMessage('Account created successfully! Please login.');
          setIsLogin(true);
          setFormData({
            username: '',
            email: '',
            password: '',
            contactNumber: '',
            address: '',
          });
        } catch (err) {
          if (err.response?.data?.message) {
            setError(err.response.data.message);
          } else {
            setError('Something went wrong. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      }
    }, 1000);
  };

  return (
    <div className="bg-black text-white min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 p-8 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">
          {isLogin ? 'Login to TravelApp' : 'Create an Account'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring"
                required
              />

              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                placeholder="Contact Number"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring"
              />

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring"
              />
            </>
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring"
            required
            minLength={4}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black py-2 rounded hover:bg-gray-200 transition"
          >
            {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
        {successMessage && (
          <p className="text-green-400 mt-4 text-center">{successMessage}</p>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={toggleMode} className="text-white underline">
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;