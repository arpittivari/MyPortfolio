// client/src/components/ui/Textarea.jsx

import React from 'react';

/**
 * A reusable styled textarea component.
 * Applies consistent styling for forms across the Admin panel.
 * @param {object} props - Standard textarea props (value, onChange, placeholder, rows, required, etc.)
 * @param {string} className - Additional Tailwind classes
 */
const Textarea = ({ className = '', ...props }) => {
  return (
    <textarea
      {...props}
      className={`admin-input ${className}`} // Uses the global admin-input style from index.css
    />
  );
};

export default Textarea;