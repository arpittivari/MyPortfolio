import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { Sun, Moon } from 'lucide-react';

/**
 * A button component to toggle between light and dark themes.
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === 'dark' ? Sun : Moon;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-300 
                 bg-gray-200 text-gray-800 
                 dark:bg-gray-800 dark:text-pcb-green 
                 hover:ring-2 hover:ring-pcb-green-light hover:scale-105"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Icon className="w-5 h-5" />
    </button>
  );
};

export default ThemeToggle;