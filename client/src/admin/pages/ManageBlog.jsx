// client/src/admin/pages/ManageBlog.jsx - HARDENED VERSION

import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Edit, Trash2, AlertTriangle, Loader2, Save, X, Calendar } from 'lucide-react';
import api from '../../services/api.js';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import MessageModal from '../../components/ui/MessageModal.jsx';
import Input from '../../components/ui/Input.jsx'; // Assuming Input exists
import Textarea from '../../components/ui/Textarea.jsx'; // Assuming Textarea exists

const initialPostState = { title: '', slug: '', category: 'Full Stack', excerpt: '', markdownContent: '' };
const CATEGORIES = ['Full Stack', 'Embedded C', 'IoT Networking', 'Edge AI', 'Machine Learning', 'Systems Architecture'];

const ManageBlog = () => {
  // Initialize posts as an empty array
  const [posts, setPosts] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [formData, setFormData] = useState(initialPostState);
  const [formLoading, setFormLoading] = useState(false); // Renamed loading state for form
  const [modal, setModal] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

  const isEditing = !!currentPost;

  // --- Fetching Logic ---
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    console.log("ManageBlog: Fetching posts..."); // DEBUG LOG
    try {
      const response = await api.get('/blog'); // Use relative path
      console.log("ManageBlog: API Response Received:", response.data); // DEBUG LOG

      // CRITICAL CHECK: Ensure response.data is an array
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.warn("ManageBlog: API did not return an array, setting posts to empty array."); // DEBUG LOG
        setPosts([]); // Set empty array if API returns null/undefined/object
      }
    } catch (err) {
      console.error("ManageBlog: Failed to fetch blog posts:", err); // DEBUG LOG
      setError("Failed to load blog posts. Check API connection and server logs.");
      setPosts([]); // Ensure posts is an empty array on error
    } finally {
      setLoading(false);
      console.log("ManageBlog: Fetching complete, loading set to false."); // DEBUG LOG
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); // Run only on component mount

  // --- Form Handlers ---
  const handleAdd = () => {
    setCurrentPost(null);
    setFormData(initialPostState);
    setIsFormVisible(true);
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setFormData(post);
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
    if (name === 'title' && !isEditing) {
      const newSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true); // Use formLoading state
    
    const dataToSend = { ...formData };
    if (!dataToSend.title || !dataToSend.slug || !dataToSend.category || !dataToSend.excerpt || !dataToSend.markdownContent) {
        setModal({ isOpen: true, type: 'error', title: 'Missing Fields', message: 'Please fill out all required fields.' });
        setFormLoading(false);
        return;
    }

    try {
      if (isEditing) {
        await api.put(`/blog/${currentPost.slug}`, dataToSend); // Use relative path
      } else {
        await api.post('/blog', dataToSend); // Use relative path
      }
      setModal({ isOpen: true, type: 'success', title: 'Success!', message: `Blog post "${dataToSend.title}" saved.` });
      handleCancel();
      fetchPosts(); 
    } catch (err) {
      console.error('Blog post save error:', err);
      setModal({ isOpen: true, type: 'error', title: 'Error Saving Post', message: err.response?.data?.message || 'Network error.' });
    } finally {
      setFormLoading(false); // Use formLoading state
    }
  };
  
  // --- Deletion Logic ---
  const confirmDelete = (post) => {
    setModal({
      isOpen: true, type: 'warning', title: 'Confirm Deletion', 
      message: `Delete post: "${post.title}"?`, confirmText: 'Yes, Delete',
      onConfirm: () => handleDelete(post.slug),
    });
  };

  const handleDelete = async (slug) => {
    setLoading(true); // Use main loading state for delete action
    try {
      await api.delete(`/blog/${slug}`); // Use relative path
      setModal({ isOpen: true, type: 'success', title: 'Deleted', message: 'Blog post deleted.' });
      fetchPosts();
    } catch (err) {
      console.error("Delete failed:", err);
      setModal({ isOpen: true, type: 'error', title: 'Deletion Failed', message: 'Could not delete post.' });
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER LOGIC ---
  console.log("ManageBlog: Rendering component. Loading:", loading, "Error:", error, "Posts:", posts); // DEBUG LOG

  // --- Render Form View ---
  if (isFormVisible) {
    // ... (Form JSX remains largely the same, ensure Input/Textarea are imported if used)
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-pcb-green/10">
        <MessageModal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-3">
          {isEditing ? `Edit: ${currentPost?.title || ''}` : 'Write New Blog Post'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title and Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Title</label>
              <Input type="text" name="title" value={formData.title} onChange={handleChange} required className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Slug (URL Path)</label>
              <Input type="text" name="slug" value={formData.slug} onChange={handleChange} required readOnly={isEditing} disabled={isEditing} className="admin-input read-only:bg-gray-100 dark:read-only:bg-gray-700" />
            </div>
          </div>
          {/* Category and Excerpt */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="admin-label">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} required className="admin-input">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Excerpt (Short Summary)</label>
              <Input type="text" name="excerpt" value={formData.excerpt} onChange={handleChange} required className="admin-input" placeholder="One-sentence teaser." />
            </div>
          </div>
          {/* Markdown Content */}
          <div>
            <label className="admin-label">Markdown Content</label>
            <Textarea name="markdownContent" value={formData.markdownContent} onChange={handleChange} required rows="15" className="admin-input font-mono" placeholder="Use Markdown here..."></Textarea>
          </div>
          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={handleCancel}> <X className="w-5 h-5 mr-2" /> Cancel </Button>
            <Button type="submit" isLoading={formLoading}> <Save className="w-5 h-5 mr-2" /> {isEditing ? 'Update Post' : 'Publish Post'} </Button>
          </div>
        </form>
      </div>
    );
  }

  // --- Render Table View ---
  return (
    <div className="space-y-6">
      <MessageModal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
          <BookOpen className="w-6 h-6 mr-2 text-pcb-green" /> Manage Blog Posts ({/* SAFE CHECK */ posts ? posts.length : 0})
        </h1>
        <Button onClick={handleAdd}> <Plus className="w-5 h-5 mr-2" /> Write New Post </Button>
      </div>

      {/* Loading State */}
      {loading && ( <div className="flex justify-center py-10"><Loader size="w-8 h-8" /></div> )}

      {/* Error State */}
      {error && ( <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg flex items-center space-x-3 text-red-700 dark:text-red-300"><AlertTriangle className="w-5 h-5" /><p className="font-medium">{error}</p></div> )}

      {/* Empty State - SAFE CHECK */}
      {!loading && (!posts || posts.length === 0) && !error && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">No blog posts found. Start writing!</p>
        </div>
      )}
      
      {/* Blog Posts List Table - SAFE CHECK */}
      {!loading && posts && posts.length > 0 && (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            {/* ... (thead remains the same - Title, Category, Slug, Published On, Actions) */}
             <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="admin-th w-1/3">Title</th>
                <th className="admin-th w-1/5">Category</th>
                <th className="admin-th w-1/5">Slug</th>
                <th className="admin-th w-1/5">Published On</th> 
                <th className="admin-th w-1/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {posts.map((post) => (
                <tr key={post._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="admin-td font-medium">{post.title}</td>
                  <td className="admin-td text-sm">{post.category}</td>
                  <td className="admin-td text-sm font-mono text-gray-500 dark:text-gray-400">{post.slug}</td>
                  <td className="admin-td text-sm">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                        <Calendar className="w-4 h-4 mr-1.5 text-pcb-green-dark" />
                        {new Date(post.createdAt).toLocaleDateString()} 
                    </div>
                  </td>
                  <td className="admin-td text-right"> 
                    <div className="flex justify-end items-center space-x-2"> 
                        <Button variant="secondary" onClick={() => handleEdit(post)} className="!p-2.5 text-blue-400 hover:bg-blue-900/30 bg-blue-900/20" aria-label={`Edit ${post.title}`}><Edit className="w-4 h-4" /></Button>
                        <Button variant="danger" onClick={() => confirmDelete(post)} className="!p-2.5 text-red-400 hover:bg-red-300 bg-red-700" aria-label={`Delete ${post.title}`}><Trash2 className="w-4 h-4" /></Button>
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