import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const estimateReadTime = (text) => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const BlogsPage = () => {
  const { currentUser } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBlogId, setExpandedBlogId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blogs');
        console.log("Received data from backend:", response.data); // 👈 add this
        const data = response.data;
        const blogsWithIds = data.map((blog, index) => ({
          ...blog,
          id: index + 1
        }));
        setBlogs(blogsWithIds);
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
      }
    };


    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.blogs?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const toggleExpand = (id) => {
    setExpandedBlogId(expandedBlogId === id ? null : id);
  };

  return (
    <div
      className="min-h-screen px-4 py-10"
      style={{
        background: 'radial-gradient(circle at top left, #1e1e2f, #0c0c15)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <h1 className="text-4xl text-center font-bold mb-10 text-white drop-shadow-lg">
        ✨ Travel Blogs
      </h1>

      <input
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-10 px-5 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-500"
      />


      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs found. Try another keyword!</p>
      ) : (
        <div className="space-y-6">
          {filteredBlogs.map((blog) => {
            const isExpanded = expandedBlogId === blog.id;
            const readTime = estimateReadTime(blog.blogs || '');

            return (
              <div
                key={blog.id}
                onClick={() => toggleExpand(blog.id)}
                className="transition border-2 border-transparent hover:border-pink-500 bg-white/5 rounded-2xl p-6 backdrop-blur-md shadow-xl cursor-pointer"
                style={{
                  borderImage: 'linear-gradient(to right, #8e2de2, #4a00e0) 1',
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-semibold text-white">{blog.title}</h2>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  By <span className="font-semibold text-pink-400">{blog.name}</span> • {readTime} min read
                </p>
                <div
                  className={`text-gray-200 whitespace-pre-line ${!isExpanded ? 'line-clamp-3' : ''}`}
                  style={{ transition: 'all 0.3s ease-in-out' }}
                  dangerouslySetInnerHTML={{ __html: blog.blogs }}
                ></div>

                <p className="mt-2 text-blue-400 italic text-sm select-none">
                  {isExpanded ? 'Click to collapse ▲' : 'Click to read more ▼'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BlogsPage;
