// client/src/admin/pages/ManageBlog.jsx

import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, AlertTriangle, Loader2, Save, X, Calendar } from 'lucide-react';
import api from '../../services/api.js';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import MessageModal from '../../components/ui/MessageModal.jsx';

const initialPostState = { 
    title: '', 
    slug: '', 
    category: 'Full Stack', 
    excerpt: '', 
    markdownContent: '' 
};

const CATEGORIES = ['Full Stack', 'Embedded C', 'IoT Networking', 'Edge AI', 'Machine Learning', 'Systems Architecture'];

const ManageBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState(initialPostState);
  const [currentPost, setCurrentPost] = useState(null); // Post object for editing
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

  const isEditing = !!currentPost;

  // --- Fetching Logic ---
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Fetch all posts, including unpublished ones
      const response = await api.get('/blog'); 
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch blog posts:", err);
      setError("Failed to load blog posts. Check API connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  
  // --- Form View Handlers ---
  const handleAdd = () => {
    setFormData(initialPostState);
    setCurrentPost(null);
    setIsFormVisible(true);
  };

  const handleEdit = (post) => {
    // Note: We use the full post object as the currentPost flag
    setFormData(post);
    setCurrentPost(post);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setCurrentPost(null);
    setFormData(initialPostState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-generate slug when title changes for new posts
    if (name === 'title' && !isEditing) {
      const newSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        // Use post slug for PUT request
        await api.put(`/blog/${currentPost.slug}`, formData);
      } else {
        await api.post('/blog', formData);
      }
      
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Success!',
        message: `Blog post "${formData.title}" saved successfully.`,
      });
      handleCancel();
      fetchPosts(); // Refresh list
    } catch (err) {
      console.error('Blog post save error:', err);
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error Saving Post',
        message: err.response?.data?.message || 'A network or server error occurred. Ensure the Slug is unique.',
      });
    } finally {
      setLoading(false);
    }
  };
  
  // --- Deletion Logic ---
  const confirmDelete = (post) => {
    setModal({
      isOpen: true,
      type: 'warning',
      title: 'Confirm Deletion',
      message: `Are you sure you want to permanently delete the post: "${post.title}"?`,
      confirmText: 'Yes, Delete',
      onConfirm: () => handleDelete(post.slug),
    });
  };

  const handleDelete = async (slug) => {
    try {
      setLoading(true);
      await api.delete(`/blog/${slug}`);
      setModal({ isOpen: true, type: 'success', title: 'Deleted', message: 'Blog post deleted successfully.' });
      fetchPosts();
    } catch (err) {
      console.error("Delete failed:", err);
      setModal({ isOpen: true, type: 'error', title: 'Deletion Failed', message: 'Could not delete post.' });
    } finally {
      setLoading(false);
    }
  };


  // --- Render Form View ---
  if (isFormVisible) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-pcb-green/10">
        <MessageModal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-3">
          {isEditing ? `Edit: ${currentPost.title}` : 'Write New Blog Post'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Title</label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} required className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Slug (URL Path)</label>
              <input type="text" name="slug" value={formData.slug} onChange={handleChange} required readOnly={isEditing} disabled={isEditing} className="admin-input read-only:bg-gray-100 dark:read-only:bg-gray-700" />
              <p className="text-xs text-gray-500 mt-1">URL path must be unique (e.g., tiny-ml-optimization)</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="admin-input">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Excerpt (Short Summary)</label>
              <input type="text" name="excerpt" value={formData.excerpt} onChange={handleChange} required className="admin-input" placeholder="A one-sentence teaser for the blog list." />
            </div>
          </div>

          <div>
            <label className="admin-label">Markdown Content</label>
            <textarea name="markdownContent" value={formData.markdownContent} onChange={handleChange} required rows="15" className="admin-input font-mono" placeholder="Use Markdown here for formatting: # Header, **bold**, `code block`"></textarea>
            <p className="text-xs text-gray-500 mt-1">Use a tool like Dillinger or VS Code extensions for Markdown preview.</p>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCancel}>
              <X className="w-5 h-5 mr-2" /> Cancel
            </Button>
            <Button type="submit" isLoading={loading}>
              <Save className="w-5 h-5 mr-2" /> {isEditing ? 'Update Post' : 'Publish Post'}
            </Button>
          </div>
        </form>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* ... (Keep MessageModal, Header, Loading, Error, Empty State) ... */}
      
      {!loading && posts.length > 0 && (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            {/* UPDATED THEAD */}
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="admin-th w-1/3">Title</th>
                <th className="admin-th w-1/5">Category</th>
                <th className="admin-th w-1/5">Slug</th>
                {/* NEW HEADER */}
                <th className="admin-th w-1/5">Published On</th> 
                <th className="admin-th w-1/5 text-right">Actions</th>
              </tr>
            </thead>
            {/* UPDATED TBODY */}
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="admin-td font-medium">
                    {post.title}
                  </td>
                  <td className="admin-td text-sm">{post.category}</td>
                  <td className="admin-td text-sm font-mono text-gray-500 dark:text-gray-400">{post.slug}</td>
                  {/* NEW DATA CELL */}
                  <td className="admin-td text-sm">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1.5 text-pcb-green-dark" />
                        {/* Format the date nicely */}
                        {new Date(post.createdAt).toLocaleDateString()} 
                    </div>
                  </td>
                  <td className="admin-td text-right"> 
                    <div className="flex justify-end items-center space-x-2"> 
                      {/* ... (Edit and Delete buttons remain the same) ... */}
                       <Button 
                            variant="secondary" 
                            onClick={() => handleEdit(post)} 
                            className="!p-2.5 text-blue-400 hover:bg-blue-900/30 bg-blue-900/20" 
                            aria-label={`Edit ${post.title}`}
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={() => confirmDelete(post)} 
                            className="!p-2.5 text-red-400 hover:bg-red-900/30 bg-red-400" 
                            aria-label={`Delete ${post.title}`}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBlog;