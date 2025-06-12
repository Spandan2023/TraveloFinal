import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

// Default blogs (const)
const DEFAULT_BLOGS = [
  {
    id: 1,
    title: "Top 10 Travel Destinations for 2025",
    content: "Discover the most amazing places to visit in 2025 and start planning your next adventure...",
    author: "TravelExpert",
    date: "May 15, 2025",
    approved: true,
    likes: 124,
  },
  {
    id: 2,
    title: "How to Pack Light for a Long Trip",
    content: "Tips and tricks on packing efficiently so you can travel comfortably without excess baggage...",
    author: "PackingPro",
    date: "April 30, 2025",
    approved: true,
    likes: 89,
  },
  {
    id: 3,
    title: "Travel Safety: What You Need to Know",
    content: "Important safety measures and precautions every traveler should take before and during their trips...",
    author: "SafetyFirst",
    date: "April 20, 2025",
    approved: true,
    likes: 156,
  }
];

// Utility: estimate read time (assuming 200 words/min)
function estimateReadTime(text) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const BlogsPage = () => {
  const { currentUser } = useAuth();

  const [blogs, setBlogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newBlog, setNewBlog] = useState({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedBlogId, setExpandedBlogId] = useState(null);

  // Load blogs from localStorage + defaults on mount
  useEffect(() => {
    // Load saved blogs from localStorage
    const savedBlogsJSON = localStorage.getItem('userBlogs');
    const savedBlogs = savedBlogsJSON ? JSON.parse(savedBlogsJSON) : [];

    // Load saved "saved" flags (like bookmarks)
    const savedFlagsJSON = localStorage.getItem('savedBlogIds');
    const savedBlogIds = savedFlagsJSON ? JSON.parse(savedFlagsJSON) : [];

    // Merge default + user blogs, mark saved flag
    const merged = [...savedBlogs, ...DEFAULT_BLOGS]
      // remove duplicates by id (user blogs have higher id)
      .reduce((acc, blog) => {
        if (!acc.find(b => b.id === blog.id)) acc.push(blog);
        return acc;
      }, [])
      // add saved flag
      .map(blog => ({
        ...blog,
        saved: savedBlogIds.includes(blog.id)
      }));

    setBlogs(merged);
  }, []);

  // Save user-posted blogs to localStorage (only those with id > default max id)
  const persistUserBlogs = (allBlogs) => {
    // user blogs are those with id > max default id (3 here)
    const userBlogs = allBlogs.filter(b => b.id > 3);
    localStorage.setItem('userBlogs', JSON.stringify(userBlogs));
  };

  // Save saved flags to localStorage
  const persistSavedBlogIds = (allBlogs) => {
    const savedBlogIds = allBlogs.filter(b => b.saved).map(b => b.id);
    localStorage.setItem('savedBlogIds', JSON.stringify(savedBlogIds));
  };

  // Handle blog save toggle (bookmark)
  const handleSaveBlog = (blogId) => {
    const updatedBlogs = blogs.map(blog =>
      blog.id === blogId ? { ...blog, saved: !blog.saved } : blog
    );
    setBlogs(updatedBlogs);
    persistSavedBlogIds(updatedBlogs);
  };

  // Submit new blog post
  const handleSubmitBlog = (e) => {
    e.preventDefault();
    if (!newBlog.title.trim() || !newBlog.content.trim()) return;
    if (!currentUser) {
      alert("You must be logged in to submit a blog.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newId = blogs.reduce((maxId, blog) => Math.max(maxId, blog.id), 0) + 1;
      const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

      const newBlogPost = {
        id: newId,
        title: newBlog.title.trim(),
        content: newBlog.content.trim(),
        author: currentUser.username || currentUser.email || "You",
        date: dateStr,
        approved: currentUser.role === 'admin',
        likes: 0,
        saved: false,
      };

      const updatedBlogs = [newBlogPost, ...blogs];
      setBlogs(updatedBlogs);
      setNewBlog({ title: '', content: '' });
      setIsSubmitting(false);

      persistUserBlogs(updatedBlogs);

      alert(currentUser.role === 'admin'
        ? 'Blog published successfully!'
        : 'Blog submitted for admin approval. Thank you!');
    }, 1000);
  };

  // Filter blogs by search term & show approved or user's own blogs
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchTerm.toLowerCase());

    const canView = blog.approved || (currentUser && blog.author === (currentUser.username || currentUser.email || "You"));

    return matchesSearch && canView;
  });

  // Toggle blog expanded view (open/close)
  const toggleExpand = (id) => {
    setExpandedBlogId(expandedBlogId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Travel Blogs</h1>

      <input
        type="text"
        placeholder="Search blogs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-8 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
      />

      {currentUser && (
        <section className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold mb-4">Share Your Travel Experience</h2>
          <form onSubmit={handleSubmitBlog}>
            <input
              type="text"
              placeholder="Blog Title"
              value={newBlog.title}
              onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
              className="w-full mb-3 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              required
            />
            <textarea
              placeholder="Write your blog content here..."
              value={newBlog.content}
              onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })}
              className="w-full mb-4 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              rows={5}
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Blog'}
            </button>
          </form>
        </section>
      )}

      <div className="space-y-6">
        {filteredBlogs.length === 0 ? (
          <p className="text-gray-400 text-center">No blogs found. Try a different search term.</p>
        ) : (
          filteredBlogs.map(blog => {
            const readTime = estimateReadTime(blog.content);
            const isExpanded = expandedBlogId === blog.id;

            return (
              <article
                key={blog.id}
                className={`bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition cursor-pointer`}
                onClick={() => toggleExpand(blog.id)}
              >
                <header className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-semibold">{blog.title}</h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveBlog(blog.id);
                    }}
                    className={`px-3 py-1 rounded-full text-sm ${blog.saved ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                    aria-label={blog.saved ? 'Unsave blog' : 'Save blog'}
                  >
                    {blog.saved ? 'Saved' : 'Save'}
                  </button>
                </header>

                <p className="text-gray-400 text-sm mb-2">
                  By {blog.author} • {blog.date} • {readTime} min read • {blog.likes} likes
                </p>

                <p className={`text-gray-300 mb-2 ${!isExpanded ? 'line-clamp-3' : ''}`}>
                  {blog.content}
                </p>

                {!blog.approved && (
                  <span className="inline-block bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                    Pending Approval
                  </span>
                )}

                <p className="text-blue-400 text-sm mt-1 italic select-none">
                  {isExpanded ? 'Click to collapse' : 'Click to read more'}
                </p>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
