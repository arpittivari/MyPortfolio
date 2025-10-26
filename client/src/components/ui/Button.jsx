import React from 'react';
import Loader from './Loader.jsx';

/**
 * A reusable, styled button component.
 * @param {object} props - Standard button props (onClick, type, disabled, children, etc.)
 * @param {string} variant - 'primary' (default) or 'secondary'
 * @param {boolean} isLoading - Shows a loader and disables the button if true.
 */
const Button = ({ children, onClick, variant = 'primary', isLoading = false, className = '', ...rest }) => {
  const baseClasses = 'flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4';
  
  let variantClasses;

  if (variant === 'primary') {
    variantClasses = 'bg-pcb-green text-gray-900 hover:bg-pcb-green-dark focus:ring-pcb-green/50';
  } else if (variant === 'secondary') {
    variantClasses = 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500/50';
  } else if (variant === 'danger') {
    variantClasses = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50';
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={isLoading || rest.disabled}
      {...rest}
    >
      {isLoading ? (
        <Loader size="w-5 h-5" color={variant === 'primary' ? 'text-gray-900' : 'text-gray-100'} />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;