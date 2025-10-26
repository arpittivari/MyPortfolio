import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';

/**
 * Custom hook to consume the ThemeContext.
 * @returns {{theme: 'light' | 'dark', toggleTheme: () => void}} The current theme and toggle function.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};