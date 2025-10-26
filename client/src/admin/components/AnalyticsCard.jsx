// client/src/admin/components/AnalyticsCard.jsx

import React from 'react';

/**
 * Reusable card to display a single analytics metric.
 * @param {object} props
 * @param {string} props.title - The title of the metric (e.g., 'Total Views')
 * @param {number} props.value - The numerical value of the metric
 * @param {React.Component} props.Icon - Lucide icon component
 */
const AnalyticsCard = ({ title, value, Icon }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg 
                    border-l-4 border-pcb-green transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </p>
        <Icon className="w-5 h-5 text-pcb-green" />
      </div>
      <p className="text-3xl font-extrabold mt-1 text-gray-900 dark:text-gray-100">
        {value.toLocaleString()}
      </p>
    </div>
  );
};

export default AnalyticsCard;