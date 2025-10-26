import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { BookOpen, Calendar, Loader2, AlertTriangle } from 'lucide-react';

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // API call to get all blog posts
        const response = await api.get('/blog');
        setPosts(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blog posts:", err);
        setError("Could not load blog posts. The server may be offline or no content has been published yet.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-4 
                     text-gray-900 dark:text-gray-100 flex items-center">
        <BookOpen className="w-8 h-8 mr-2 text-pcb-green" />
        Technical Insights
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 border-b pb-4">
        Deep dives into Embedded C, TinyML optimization, and MERN stack architecture.
      </p>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-pcb-green" />
          <span className="ml-3 text-lg">Loading blog content...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg flex items-center space-x-3 text-red-700 dark:text-red-300">
          <AlertTriangle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-8">
        {!loading && posts.length > 0 ? (
          posts.map((post) => (
            <Link 
              key={post._id}
              to={`/blog/${post.slug}`}
              className="block bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg 
                         hover:shadow-xl transform transition-all duration-300 hover:scale-[1.01] 
                         border border-gray-200 dark:border-gray-700 group"
            >
              <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 group-hover:text-pcb-green transition-colors">
                {post.title}
              </h2>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <span>{post.category}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-3">
                {post.excerpt}
              </p>
            </Link>
          ))
        ) : (
          !loading && !error && (
            <div className="text-center p-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    No articles published yet. Check back soon!
                </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Blog;