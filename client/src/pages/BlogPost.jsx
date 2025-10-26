import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import api from '../services/api.js';
import { Loader2, Calendar, BookOpen, ChevronLeft } from 'lucide-react';

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get(`/blog/${slug}`);
        setPost(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch blog post:", err);
        setError("Article not found or server error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-pcb-green" />
        <span className="ml-3 text-lg">Loading article...</span>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center p-10">
        <h1 className="text-3xl font-bold text-red-500 dark:text-red-400">{error || "Post Not Found"}</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">The requested article could not be loaded.</p>
        <Link to="/blog" className="mt-6 inline-flex items-center text-pcb-green hover:underline">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Blog
        </Link>
      </div>
    );
  }
  
  // Custom renderer for markdown headers to apply Tailwind styling
  const components = {
    h1: ({ node, ...props }) => <h1 className="text-3xl md:text-4xl font-extrabold mt-8 mb-4 border-b pb-2 text-gray-900 dark:text-gray-100" {...props} />,
    h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-gray-100" {...props} />,
    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-900 dark:text-gray-100" {...props} />,
    p: ({ node, ...props }) => <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />,
    li: ({ node, ...props }) => <li className="pl-2" {...props} />,
    a: ({ node, ...props }) => <a className="text-pcb-green hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
    code: ({ node, ...props }) => <code className="bg-gray-200 dark:bg-gray-700 text-red-500 px-1 py-0.5 rounded text-sm" {...props} />,
    pre: ({ node, ...props }) => <pre className="overflow-x-auto p-4 my-4 rounded-lg bg-gray-800 text-gray-200 text-sm" {...props} />,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/blog" className="inline-flex items-center text-pcb-green hover:underline mb-6">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Articles
      </Link>
      
      {/* Post Header */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-3 text-gray-900 dark:text-gray-100">
        {post.title}
      </h1>
      <div className="flex items-center space-x-4 text-base text-gray-500 dark:text-gray-400 mb-8 border-b pb-6">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <span>Published on {new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
        <span className="font-semibold text-pcb-green">{post.category}</span>
      </div>

      {/* Markdown Content */}
      <article className="prose dark:prose-invert max-w-none">
        <ReactMarkdown components={components}>{post.markdownContent}</ReactMarkdown>
      </article>

    </div>
  );
};

export default BlogPost;