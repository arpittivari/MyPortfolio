// client/src/components/ui/Button.jsx - FINAL FIX FOR AS="A" PROP

import React from 'react';
import Loader from './Loader.jsx';

/**
 * A reusable styled component that can render as a button or an anchor link.
 * @param {object} props - Standard props.
 * @param {'button' | 'a'} as - Component to render (default 'button').
 * @param {string} variant - 'primary', 'secondary', or 'danger'.
 * @param {boolean} isLoading - Shows a loader.
 */
const Button = ({ children, onClick, as = 'button', variant = 'primary', isLoading = false, className = '', ...rest }) => {
  const baseClasses = 'flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 disabled:opacity-70 disabled:cursor-not-allowed';
  
  let variantClasses;

  if (variant === 'primary') {
    variantClasses = 'bg-pcb-green text-gray-900 hover:bg-pcb-green-dark focus:ring-pcb-green/50';
  } else if (variant === 'secondary') {
    variantClasses = 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-gray-500/50';
  } else if (variant === 'danger') {
    variantClasses = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50';
  }

  // CRITICAL FIX: Dynamically determine the component type
  const Component = as; 

  // If rendering as an anchor tag, 'disabled' property should not be passed to <a>, 
  // but we can pass it through to the rest of the attributes for simple logic.
  const isDisabled = isLoading || rest.disabled;

  return (
    <Component
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''} ${className}`}
      disabled={Component === 'button' ? isDisabled : undefined} // Only pass 'disabled' prop if it's a <button>
      {...rest} // Pass all other props (href, target, rel, etc.)
    >
      {isLoading ? (
        <Loader size="w-5 h-5" color={variant === 'primary' ? 'text-gray-900' : 'text-gray-100'} />
      ) : (
        children
      )}
    </Component>
  );
};

export default Button;