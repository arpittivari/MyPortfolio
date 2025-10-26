import React from 'react';
import { Layers, Lightbulb, Zap, Cpu, Code } from 'lucide-react';

/**
 * Reusable card to display a category of skills (e.g., Embedded, IoT, ML).
 */
const SkillCard = ({ skillCategory }) => {
  const { category, skills } = skillCategory;

  // Determine which icon to show based on category
  const getIcon = (cat) => {
    const lowerCat = cat.toLowerCase();
    if (lowerCat.includes('embedded') || lowerCat.includes('iot')) return Cpu;
    if (lowerCat.includes('ai') || lowerCat.includes('learning')) return Lightbulb;
    if (lowerCat.includes('backend') || lowerCat.includes('api')) return Zap;
    return Layers;
  };

  const Icon = getIcon(category);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 
                    border-t-4 border-pcb-green transition-shadow duration-300 hover:shadow-xl">
      
      {/* Category Header */}
      <div className="flex items-center mb-4 space-x-3">
        <div className="p-3 rounded-full bg-pcb-green/10 text-pcb-green dark:bg-pcb-green-dark/20">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {category}
        </h3>
      </div>

      {/* Skills List */}
      <div className="space-y-2">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Code className="w-4 h-4 flex-shrink-0 dark:text-gray-300 text-base" />
            <span className="text-gray-700 dark:text-gray-300 text-base">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillCard;