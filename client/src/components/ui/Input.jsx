// client/src/components/ui/Input.jsx

import React from 'react';

/**
 * A reusable styled input component.
 * Applies consistent styling for forms across the Admin panel.
 * @param {object} props - Standard input props (type, value, onChange, placeholder, required, etc.)
 * @param {string} className - Additional Tailwind classes
 */
const Input = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`admin-input ${className}`} // Uses the global admin-input style from index.css
    />
  );
};

export default Input;