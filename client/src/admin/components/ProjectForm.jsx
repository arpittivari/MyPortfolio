// client/src/admin/components/ProjectForm.jsx

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Save, X, Cpu, TrendingUp } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import MessageModal from '../../components/ui/MessageModal.jsx';
import api from '../../services/api.js';

// Initial state matching the Mongoose schema (project.model.js)
const initialProjectState = {
  title: '',
  slug: '',
  category: 'Embedded Systems',
  shortDescription: '',
  fullDescription: '',
  repoUrl: '',
  liveUrl: '',
  imageUrl: 'https://placehold.co/800x600/1f2937/a7f3d0?text=Project+Placeholder',
  techStack: ['React', 'Node.js', 'MongoDB'],
  engineeringDecisions: [
    { tool: 'ESP32', reason: 'Chosen for integrated WiFi/BLE and dual-core processing.' }
  ],
  isFeatured: false,
  // Fields for interactive features
  interactiveDemo: {
    type: 'None', // 'IoT_Dashboard', 'ML_Game', 'AIChatBot'
    dataEndpoint: '',
    githubLink: '', 
  },
};

const CATEGORIES = ['Embedded Systems', 'IoT', 'Edge AI', 'Machine Learning', 'Full Stack'];
const INTERACTIVE_TYPES = ['None', 'IoT_Dashboard', 'ML_Game', 'AIChatBot'];

const ProjectForm = ({ projectToEdit, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialProjectState);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });

  const isEditing = !!projectToEdit;

  useEffect(() => {
    if (projectToEdit) {
      // Deep merge the project data onto the initial state to ensure all fields are present
      setFormData(prev => ({ 
        ...initialProjectState, 
        ...projectToEdit,
        interactiveDemo: { ...initialProjectState.interactiveDemo, ...projectToEdit.interactiveDemo } 
      }));
    } else {
      setFormData(initialProjectState);
    }
  }, [projectToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Auto-generate slug when title changes for new projects
    if (name === 'title' && !isEditing) {
      const newSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug: newSlug }));
    }
  };

  const handleDecisionChange = (index, field, value) => {
    const newDecisions = [...formData.engineeringDecisions];
    newDecisions[index][field] = value;
    setFormData(prev => ({ ...prev, engineeringDecisions: newDecisions }));
  };

  const addDecision = () => {
    setFormData(prev => ({
      ...prev,
      engineeringDecisions: [...prev.engineeringDecisions, { tool: '', reason: '' }]
    }));
  };

  const removeDecision = (index) => {
    setFormData(prev => ({
      ...prev,
      engineeringDecisions: prev.engineeringDecisions.filter((_, i) => i !== index)
    }));
  };
  
  const handleTechStackChange = (e) => {
    // Splits comma-separated string into an array, trimming whitespace
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    setFormData(prev => ({ ...prev, techStack: tags }));
  };
  
  const handleInteractiveDemoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      interactiveDemo: {
        ...prev.interactiveDemo,
        [name]: value,
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEditing) {
        await api.put(`/projects/${formData.slug}`, formData);
      } else {
        await api.post('/projects', formData);
      }

      setModal({
        isOpen: true,
        type: 'success',
        title: 'Success!',
        message: `Project "${formData.title}" saved successfully.`,
      });
      
      onSave(); // Trigger a data refresh in the parent component
    } catch (err) {
      console.error('Project save error:', err);
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Error Saving Project',
        message: err.response?.data?.message || 'A network or server error occurred. Check the console for details.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-pcb-green/10">
      
      <MessageModal {...modal} onClose={() => setModal({ ...modal, isOpen: false })} />

      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 border-b pb-3">
        {isEditing ? `Edit: ${projectToEdit.title}` : 'Add New Project'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Slug (URL Path)</label>
            <input type="text" name="slug" value={formData.slug} onChange={handleChange} required readOnly={isEditing} disabled={isEditing} className="admin-input read-only:bg-gray-100 dark:read-only:bg-gray-700" />
          </div>
        </div>

        <div>
          <label className="admin-label">Short Description</label>
          <textarea name="shortDescription" value={formData.shortDescription} onChange={handleChange} required rows="2" className="admin-input"></textarea>
        </div>
        
        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="admin-label">GitHub URL</label>
            <input type="url" name="repoUrl" value={formData.repoUrl} onChange={handleChange} className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Live Demo URL</label>
            <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="admin-input" />
          </div>
        </div>
        
        {/* Category & Featured */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="admin-label">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} required className="admin-input">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="admin-label">Image URL (Mockup)</label>
            <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="admin-input" />
          </div>
          <div className="flex items-center pt-6">
            <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="w-5 h-5 text-pcb-green rounded focus:ring-pcb-green" />
            <label htmlFor="isFeatured" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">Feature on Homepage</label>
          </div>
        </div>
        
        {/* Tech Stack */}
        <div>
          <label className="admin-label">Tech Stack (Comma Separated)</label>
          <input type="text" value={formData.techStack.join(', ')} onChange={handleTechStackChange} required className="admin-input" placeholder="e.g., Python, TensorFlow Lite, ESP32, React" />
        </div>

        {/* Full Description (Markdown) */}
        <div>
          <label className="admin-label">Full Description (Supports Markdown)</label>
          <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} required rows="8" className="admin-input font-mono"></textarea>
        </div>

        {/* =====================================================
          ENGINEERING DECISIONS (ECE Proof)
          ===================================================== */}
        <h3 className="text-xl font-semibold mt-8 border-b pb-2 text-gray-900 dark:text-gray-100 flex items-center">
          <Cpu className="w-5 h-5 mr-2 text-pcb-green" /> Engineering Decisions
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Explain WHY you chose key components/frameworks. (e.g., Why ESP32? Why Mongoose?)
        </p>

        <div className="space-y-4">
          {formData.engineeringDecisions.map((decision, index) => (
            <div key={index} className="flex space-x-4 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg items-center">
              <input 
                type="text" 
                placeholder="Tool/Component (e.g., 'I2C Bus')" 
                value={decision.tool} 
                onChange={(e) => handleDecisionChange(index, 'tool', e.target.value)} 
                className="admin-input flex-1"
                required
              />
              <input 
                type="text" 
                placeholder="Reason (e.g., 'High-speed, low-pin count communication')" 
                value={decision.reason} 
                onChange={(e) => handleDecisionChange(index, 'reason', e.target.value)} 
                className="admin-input flex-2"
                required
              />
              <Button 
                type="button" 
                variant="danger" 
                onClick={() => removeDecision(index)}
                className="flex-shrink-0 !p-3"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button type="button" onClick={addDecision} variant="secondary" className="w-full">
            <Plus className="w-4 h-4 mr-2" /> Add Engineering Decision
          </Button>
        </div>
        
        {/* =====================================================
          INTERACTIVE DEMO SETUP
          ===================================================== */}
        <h3 className="text-xl font-semibold mt-8 border-b pb-2 text-gray-900 dark:text-gray-100 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-pcb-green" /> Interactive Demo
        </h3>
        
        <div>
          <label className="admin-label">Demo Type</label>
          <select 
            name="type" 
            value={formData.interactiveDemo.type} 
            onChange={handleInteractiveDemoChange} 
            className="admin-input"
          >
            {INTERACTIVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        
        {formData.interactiveDemo.type !== 'None' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="admin-label">Data Endpoint (Mock/Real)</label>
              <input 
                type="text" 
                name="dataEndpoint" 
                value={formData.interactiveDemo.dataEndpoint} 
                onChange={handleInteractiveDemoChange} 
                className="admin-input" 
                placeholder="/api/data/mock-temp"
              />
            </div>
            <div>
              <label className="admin-label">Demo GitHub Link (Optional)</label>
              <input 
                type="url" 
                name="githubLink" 
                value={formData.interactiveDemo.githubLink} 
                onChange={handleInteractiveDemoChange} 
                className="admin-input" 
                placeholder="Link to the client-side demo code"
              />
            </div>
          </div>
        )}


        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            <X className="w-5 h-5 mr-2" /> Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            <Save className="w-5 h-5 mr-2" /> {isEditing ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;