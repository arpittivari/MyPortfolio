import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, Loader2, Save, X, Settings } from 'lucide-react';
import api from '../../services/api.js';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import MessageModal from '../../components/ui/MessageModal.jsx';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx';

const initialPostState = { category: '', skills: '' };
const CATEGORIES = ['Full Stack', 'Embedded C', 'IoT Networking', 'Edge AI', 'Machine Learning', 'Systems Architecture'];

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formCategory, setFormCategory] = useState('');
  const [formSkillsList, setFormSkillsList] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);
  const [messageModal, setMessageModal] = useState({
    isVisible: false,
    type: 'info',
    title: '',
    message: '',
    onConfirm: () => setMessageModal({ ...messageModal, isVisible: false }),
    onCancel: null,
  });

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/skills');
      if (Array.isArray(response.data)) {
        setSkills(response.data);
      } else {
        setSkills([]);
      }
    } catch (err) {
      setError('Failed to load skills. Please try again.');
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormCategory('');
    setFormSkillsList('');
    setEditingSkill(null);
    setIsFormVisible(false);
    setFormError(null);
  };

  const handleAddClick = () => {
    resetForm();
    setIsFormVisible(true);
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormCategory(skill.category);
    setFormSkillsList(skill.skills.join(', '));
    setIsFormVisible(true);
  };

  const confirmDelete = (skill) => {
    setMessageModal({
      isVisible: true,
      type: 'warning',
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete the skill category "${skill.category}"? This action cannot be undone.`,
      onConfirm: () => {
        setMessageModal({ ...messageModal, isVisible: false });
        handleDelete(skill._id);
      },
      onCancel: () => setMessageModal({ ...messageModal, isVisible: false }),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
  };

  const handleDelete = async (skillId) => {
    setFormLoading(true);
    try {
      await api.delete(`/skills/${skillId}`);
      fetchSkills();
      setMessageModal({
        isVisible: true,
        type: 'success',
        title: 'Skill Category Deleted',
        message: 'The skill category has been successfully removed.',
        onConfirm: () => setMessageModal({ ...messageModal, isVisible: false }),
      });
    } catch (err) {
      setMessageModal({
        isVisible: true,
        type: 'error',
        title: 'Deletion Failed',
        message: err.response?.data?.message || 'Failed to delete skill category. Please try again.',
        onConfirm: () => setMessageModal({ ...messageModal, isVisible: false }),
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    const skillsArray = formSkillsList.split(',').map(s => s.trim()).filter(s => s !== '');

    if (!formCategory || skillsArray.length === 0) {
      setFormError('Category and at least one skill are required.');
      setFormLoading(false);
      return;
    }

    const skillData = {
      category: formCategory,
      skills: skillsArray,
    };

    try {
      if (editingSkill) {
        await api.put(`/skills/${editingSkill._id}`, skillData);
      } else {
        await api.post('/skills', skillData);
      }
      
      setMessageModal({
        isVisible: true,
        type: 'success',
        title: 'Skill Category Saved',
        message: 'The skill category has been successfully saved.',
      });
      fetchSkills();
      resetForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save skill. Check server logs.');
    } finally {
      setFormLoading(false);
    }
  };

  // --- RENDER LOGIC ---

  // --- Render Form View ---
  if (isFormVisible) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-pcb-green/10 max-w-3xl"> {/* Added dark theme support */}
        <MessageModal {...messageModal} />
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-3">
          {editingSkill ? `Edit Skill Category: ${editingSkill.category}` : 'Add New Skill Category'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="category" className="admin-label text-gray-700 dark:text-gray-300">
              Category Name
            </label>
            <Input
              id="category"
              type="text"
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              placeholder="e.g., Embedded Systems, AI/ML"
              required
              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="skillsList" className="admin-label text-gray-700 dark:text-gray-300">
              Skills (comma-separated)
            </label>
            <Textarea
              id="skillsList"
              value={formSkillsList}
              onChange={(e) => setFormSkillsList(e.target.value)}
              placeholder="e.g., Python, C++, JavaScript, Rust"
              rows="3"
              required
              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 mt-1">Separate individual skills with commas.</p>
          </div>
          {formError && (
            <div className="text-red-600 dark:text-red-400 text-sm">{formError}</div>
          )}
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={resetForm} 
              disabled={formLoading}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={formLoading}
              className="px-4 py-2"
            >
              {formLoading ? 'Saving...' : (editingSkill ? 'Update Skill' : 'Create Skill')}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // --- Render Table View ---
  return (
    <div className="space-y-6">
      <MessageModal {...messageModal} onClose={() => setMessageModal({ ...messageModal, isVisible: false })} />
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage Skills
        </h1>
        <Button onClick={handleAddClick} className="flex items-center space-x-2 px-5 py-2.5 rounded-lg">
          <Plus className="w-5 h-5" />
          <span>Add New Skill Category</span>
        </Button>
      </div>

      {/* Main Content Area: Empty/Loading/Error/Table */}
      {/* FIX 5: Main table container uses dynamic theme classes */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-pcb-green-dark">
        {/* Loading/Error/Empty States (Logic unchanged, colors fixed) */}
        {loading && ( <div className="flex justify-center py-10"><Loader size="w-8 h-8" /></div> )}
        {error && ( <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg flex items-center space-x-3 text-red-700 dark:text-red-300 border border-red-700/50"><AlertTriangle className="w-5 h-5" /><p className="font-medium">{error}</p></div> )}
        {!loading && (!skills || skills.length === 0) && !error && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No skill categories detected. Click "Add New Skill Category" to begin.</p>
          </div>
        )}

        {/* Skills List Table - Matches Cart Fleet Management */}
        {!loading && skills.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"> {/* FIX 6: Divide colors fixed */}
              {/* Table Header Row */}
              <thead className="bg-gray-50 dark:bg-gray-700"> {/* FIX 7: Header background fixed */}
                <tr>
                  <th className="admin-th text-left text-gray-500 dark:text-gray-300">CATEGORY</th> 
                  <th className="admin-th text-left text-gray-500 dark:text-gray-300">SKILLS</th>
                  <th className="admin-th text-right text-gray-500 dark:text-gray-300">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700"> {/* FIX 8: Divide colors fixed */}
                {skills.map((skill) => (
                  <tr key={skill._id} className="bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/50 transition-colors"> {/* FIX 9: Row colors fixed */}
                    
                    {/* Category Column - Now converts text color */}
                    <td className="admin-td">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full 
                                       bg-pcb-green/20 text-pcb-green-dark 
                                       dark:bg-pcb-green-dark/30 dark:text-pcb-green-light">
                        {skill.category}
                      </span>
                    </td>
                    
                    {/* Skills Column - Displayed as Tags */}
                    <td className="admin-td">
                      <div className="flex flex-wrap gap-2">
                          {skill.skills.map((s, i) => (
                              <span key={i} className="px-3 py-1 text-xs font-medium rounded-full 
                                                       bg-gray-200 text-gray-700 
                                                       dark:bg-gray-700 dark:text-gray-300">
                                  {s}
                              </span>
                          ))}
                      </div>
                    </td>
                    
                    {/* Actions Column - Button Colors Fixed */}
                    <td className="admin-td text-right">
                      <div className="flex justify-end items-center space-x-2"> 
                          <Button 
                              variant="secondary" 
                              onClick={() => handleEdit(skill)} 
                              className="!p-2.5 text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50" 
                              aria-label={`Edit ${skill.category}`}
                          >
                              <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                              variant="danger" 
                              onClick={() => confirmDelete(skill)} 
                              // FIX 10: Delete Button colors fixed for both modes
                              className="!p-2.5 text-red-400 hover:bg-red-400 bg-red-700"
                              aria-label={`Delete ${skill.category}`}
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
    </div>
  );
};

export default ManageSkills;