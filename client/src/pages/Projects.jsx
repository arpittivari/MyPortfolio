import React, { useEffect, useState } from 'react';
import ProjectCard from '../components/ui/ProjectCard.jsx';
import api from '../services/api.js';
import { Loader2, Zap, AlertTriangle } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // API call to get all projects
        const response = await api.get('/projects');
        setProjects(response.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        // Display a user-friendly error message
        setError("Could not load projects. The server may be offline or no data has been added yet.");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-4 
                     text-gray-900 dark:text-gray-100 flex items-center">
        <Zap className="w-8 h-8 mr-2 text-pcb-green" />
        Project Showcase
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 border-b pb-4">
        A demonstration of full-stack, embedded, and intelligent systems expertise.
      </p>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-pcb-green" />
          <span className="ml-3 text-lg">Loading project data...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg flex items-center space-x-3 text-red-700 dark:text-red-300">
          <AlertTriangle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!loading && projects.length > 0 && projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}

        {/* Placeholder if no projects are loaded (and no error occurred) */}
        {!loading && projects.length === 0 && !error && (
            <div className="col-span-full text-center p-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                <p className="text-lg font-medium text-gray-500 dark:text-gray-400">
                    No projects found. Please log into the Admin panel and add your first project!
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Projects;