import React from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Server, TrendingUp, BookOpen, ChevronRight } from 'lucide-react';

/**
 * Reusable card component to display a summary of a single project.
 */
const ProjectCard = ({ project }) => {
  // Determine which icon to show based on category
  const getIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'embedded systems':
        return Cpu;
      case 'iot':
        return Server;
      case 'edge ai':
        return TrendingUp;
      case 'machine learning':
        return BookOpen;
      default:
        return Cpu;
    }
  };

  const Icon = getIcon(project.category);

  return (
    <Link 
      to={`/projects/${project.slug}`}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden 
                 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
                 border border-gray-200 dark:border-gray-700 relative group"
      aria-label={`View project details for ${project.title}`}
    >
      {/* Background/Aesthetic Detail (PCB Glow) */}
      <div className="absolute inset-0 bg-gradient-to-br from-pcb-green/10 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>

      <div className="p-6 flex flex-col justify-between h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-full bg-pcb-green/10 text-pcb-green dark:bg-pcb-green-dark/20">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-pcb-green transition-colors">
              {project.title}
            </h3>
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
          {project.shortDescription}
        </p>

        {/* Tech Stack Chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 4).map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium rounded-full 
                         bg-gray-200 text-gray-700 
                         dark:bg-gray-700 dark:text-gray-300"
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 4 && (
             <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500">
                +{project.techStack.length - 4} more
             </span>
          )}
        </div>

        {/* Read More Link */}
        <div className="flex items-center justify-between text-pcb-green font-semibold">
          <span className="text-sm flex items-center">
            View Project Details
          </span>
          <ChevronRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;