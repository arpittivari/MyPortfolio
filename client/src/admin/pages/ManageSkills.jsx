// client/src/admin/pages/ManageSkills.jsx - REVISED UI

import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import api from '../../services/api.js';
import Loader from '../../components/ui/Loader.jsx';
import MessageModal from '../../components/ui/MessageModal.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Textarea from '../../components/ui/Textarea.jsx'; // Assuming you have a Textarea component

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null); // Holds skill being edited
  const [formCategory, setFormCategory] = useState('');
  const [formSkillsList, setFormSkillsList] = useState(''); // Comma-separated string
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  // Message Modal State
  const [messageModal, setMessageModal] = useState({
    isVisible: false,
    type: 'info', // 'success', 'error', 'warning', 'info'
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
      // CRITICAL FIX: Change '/api/skills' to '/skills'
      const response = await api.get('/skills'); 
      setSkills(response.data);
    } catch (err) {
       // ... (error handling)
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
    setFormSkillsList(skill.skills.join(', ')); // Convert array to comma-separated string
    setIsFormVisible(true);
  };

  const handleDelete = async (skillId) => {
    setFormLoading(true);
    try {
      await api.delete(`/api/skills/${skillId}`);
      fetchSkills(); // Refresh the list
      setMessageModal({
        isVisible: true,
        type: 'success',
        title: 'Skill Category Deleted',
        message: 'The skill category has been successfully removed.',
        onConfirm: () => setMessageModal({ ...messageModal, isVisible: false }),
      });
    } catch (err) {
      console.error('Failed to delete skill:', err);
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

  const confirmDelete = (skill) => {
    setMessageModal({
      isVisible: true,
      type: 'warning',
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete the skill category "${skill.category}"? This action cannot be undone.`,
      onConfirm: () => {
        setMessageModal({ ...messageModal, isVisible: false }); // Close warning modal
        handleDelete(skill._id); // Proceed with deletion
      },
      onCancel: () => setMessageModal({ ...messageModal, isVisible: false }),
      confirmText: 'Delete',
      cancelText: 'Cancel',
    });
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
        // Use relative path: /skills/:id
        await api.put(`/skills/${editingSkill._id}`, skillData); 
        setMessageModal({
          isVisible: true,
          type: 'success',
          title: 'Skill Category Updated',
          message: 'The skill category has been successfully updated.',
          onConfirm: () => setMessageModal({ ...messageModal, isVisible: false }),
        });
      } else {
        // CRITICAL FIX: Use relative path: /skills
        await api.post('/skills', skillData); 
        setMessageModal({
          isVisible: true,
          type: 'success',
          title: 'Skill Category Created',
          message: 'A new skill category has been successfully added.',
          onConfirm: () => setMessageModal({ ...messageModal, isVisible: false }),
        });
      }
      fetchSkills(); // Refresh list after successful save
      resetForm(); // Close form and reset state
    } catch (err) {
      console.error('Skill save error:', err);
      // Display specific backend error message if available
      setFormError(err.response?.data?.message || 'Failed to save skill. Check server logs.');
    } finally {
      setFormLoading(false);
    }
  };

  // --- Render UI ---
  return (
    <div className="admin-content-area"> {/* Use a main wrapper for consistent padding */}
      <MessageModal {...messageModal} />

      {/* Header Section - Matches Cart Fleet Management */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manage Skills
        </h1>
        <Button onClick={handleAddClick} className="flex items-center space-x-2 px-5 py-2.5 rounded-lg">
          <Plus className="w-5 h-5" />
          <span>Add New Skill Category</span>
        </Button>
      </div>

      {/* Add/Edit Skill Form - Hidden/Shown based on state */}
      {isFormVisible && (
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-6 border border-pcb-green-dark">
          <h2 className="text-xl font-semibold text-white mb-4">
            {editingSkill ? `Edit Skill Category: ${editingSkill.category}` : 'Add New Skill Category'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Category Name
              </label>
              <Input
                id="category"
                type="text"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                placeholder="e.g., Programming Languages, Embedded Systems, AI/ML"
                required
                className="w-full bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div>
              <label htmlFor="skillsList" className="block text-sm font-medium text-gray-300 mb-1">
                Skills (comma-separated)
              </label>
              <Textarea
                id="skillsList"
                value={formSkillsList}
                onChange={(e) => setFormSkillsList(e.target.value)}
                placeholder="e.g., Python, C++, JavaScript, Rust"
                rows="3"
                required
                className="w-full bg-gray-700 border-gray-600 text-white"
              />
            </div>
            {formError && (
              <div className="text-red-400 text-sm">{formError}</div>
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
      )}

      {/* Main Content Area: Empty/Loading/Error/Table */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-pcb-green-dark">
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-10">
            <Loader size="w-8 h-8" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/30 p-4 rounded-lg flex items-center space-x-3 text-red-300 border border-red-700">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && skills.length === 0 && !error && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-lg font-medium">
              No skill categories detected. Click "Add New Skill Category" to begin.
            </p>
          </div>
        )}

        {/* Skills List Table - Matches Cart Fleet Management */}
        {!loading && skills.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="admin-th text-left text-gray-300">CATEGORY</th> 
                  <th className="admin-th text-left text-gray-300">SKILLS</th>
                  <th className="admin-th text-right text-gray-300">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {skills.map((skill) => (
                  <tr key={skill._id} className="hover:bg-gray-700/50 transition-colors">
                    {/* Category Column */}
                    <td className="admin-td text-pcb-green-light font-medium">
                      {skill.category}
                    </td>
                    {/* Skills Column - Displayed as Tags */}
                    <td className="admin-td">
                      <div className="flex flex-wrap gap-2">
                        {skill.skills.map((s, i) => (
                          <span key={i} className="px-3 py-1 text-xs font-medium rounded-full 
                                                   bg-gray-600 text-gray-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    {/* Actions Column - Buttons with Icons */}
                    <td className="admin-td text-right"> {/* Remove space-x from td */}
    {/* CRITICAL FIX: Add a div wrapper with flex classes */}
    <div className="flex justify-end items-center space-x-2"> {/* Use space-x-2 or space-x-3 */}
        <Button 
            variant="secondary" 
            onClick={() => handleEdit(skill)} 
            className="!p-2.5 text-blue-400 hover:bg-blue-900/30 bg-blue-900/20" // Matching Project styles
            aria-label={`Edit ${skill.category}`}
        >
            <Edit className="w-4 h-4" />
        </Button>
        <Button 
            variant="danger" 
            onClick={() => confirmDelete(skill)} 
            className="!p-2.5 text-red-400 hover:bg-red-900/30 bg-red-400" // Matching Project styles
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