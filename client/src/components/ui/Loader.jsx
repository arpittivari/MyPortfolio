import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * A basic loading spinner component.
 * @param {string} size - Tailwind size class (e.g., 'w-6 h-6')
 * @param {string} color - Tailwind text color class (e.g., 'text-pcb-green')
 */
const Loader = ({ size = 'w-6 h-6', color = 'text-pcb-green' }) => {
  return (
    <div className="flex justify-center items-center" role="status" aria-label="Loading">
      <Loader2 className={`${size} ${color} animate-spin`} />
    </div>
  );
};

export default Loader;