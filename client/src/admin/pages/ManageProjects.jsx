// client/src/admin/pages/ManageProjects.jsx

import React, { useEffect, useState } from 'react';
import { Code, Plus, Edit, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import Button from '../../components/ui/Button.jsx';
import Loader from '../../components/ui/Loader.jsx';
import ProjectForm from '../components/ProjectForm.jsx';
import MessageModal from '../../components/ui/MessageModal.jsx';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentProject, setCurrentProject] = useState(null); // For editing
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: 'warning', title: '', message: '', onConfirm: null });

  // --- Fetching Logic ---
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load projects. Check API connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // --- Handlers ---
  const handleAddProject = () => {
    setCurrentProject(null);
    setIsFormVisible(true);
  };
  
  const handleEditProject = (project) => {
    setCurrentProject(project);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setCurrentProject(null);
  };
  
  const handleSave = () => {
    setIsFormVisible(false);
    setCurrentProject(null);
    fetchProjects(); // Refresh the list
  };
  
  const confirmDelete = (project) => {
    setModal({
      isOpen: true,
      type: 'warning',
      title: 'Confirm Deletion',
      message: `Are you sure you want to permanently delete the project: "${project.title}"? This cannot be undone.`,
      confirmText: 'Yes, Delete',
      onConfirm: () => handleDelete(project.slug),
    });
  };

  const handleDelete = async (slug) => {
    try {
      setLoading(true);
      await api.delete(`/projects/${slug}`);
      setModal({ isOpen: true, type: 'success', title: 'Deleted', message: 'Project deleted successfully.' });
      fetchProjects();
    } catch (err) {
      console.error("Delete failed:", err);
      setModal({ isOpen: true, type: 'error', title: 'Deletion Failed', message: 'Could not delete project due to a server error.' });
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---
  if (isFormVisible) {
    return <ProjectForm projectToEdit={currentProject} onSave={handleSave} onCancel={handleCancel} />;
  }

  return (
    <div className="space-y-6">
      <MessageModal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />

      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
          <Code className="w-6 h-6 mr-2 text-pcb-green" /> Manage Projects ({projects.length})
        </h1>
        <Button onClick={handleAddProject}>
          <Plus className="w-5 h-5 mr-2" /> Add New Project
        </Button>
      </div>

      {loading && (
        <div className="flex justify-center py-10">
          <Loader size="w-8 h-8" />
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg flex items-center space-x-3 text-red-700 dark:text-red-300">
          <AlertTriangle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {!loading && projects.length === 0 && !error && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-700">
          <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
            No projects found. Start by adding your first ECE masterpiece!
          </p>
        </div>
      )}

      {/* Projects List Table */}
      {!loading && projects.length > 0 && (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-md">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="admin-th w-1/3">Title</th>
                <th className="admin-th w-1/5">Category</th>
                <th className="admin-th w-1/5">Status</th>
                <th className="admin-th w-1/5">Last Updated</th>
                <th className="admin-th w-1/5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project) => (
                <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="admin-td font-medium">
                    {project.title}
                    {project.isFeatured && <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-pcb-green/20 text-pcb-green-dark">Featured</span>}
                  </td>
                  <td className="admin-td text-sm">{project.category}</td>
                  <td className="admin-td">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full 
                      ${project.interactiveDemo.type !== 'None' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                      {project.interactiveDemo.type !== 'None' ? project.interactiveDemo.type : 'Static'}
                    </span>
                  </td>
                  <td className="admin-td text-sm">
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </td>
                  <td className="admin-td text-right"> {/* Remove space-x from td */}
    {/* CRITICAL FIX: Add a div wrapper with flex classes */}
    <div className="flex justify-end items-center space-x-2"> {/* Use space-x-2 or space-x-3 */}
        <Button 
            variant="secondary" 
            onClick={() => handleEditProject(project)} 
            className="!p-2.5" // Keep small padding
            aria-label={`Edit ${project.title}`}
        >
            <Edit className="w-4 h-4" />
        </Button>
        <Button 
            variant="danger" 
            onClick={() => confirmDelete(project)} 
            className="!p-2.5"
            aria-label={`Delete ${project.title}`}
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

export default ManageProjects;