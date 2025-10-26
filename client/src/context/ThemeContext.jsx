import React, { createContext, useState, useEffect } from 'react';

// 1. Create the Context object
const ThemeContext = createContext();

// 2. The Provider component
const ThemeProvider = ({ children }) => {
  // Determine initial theme from localStorage or system preference
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    // Default to 'dark' to match the PCB aesthetic
    return 'dark';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Effect to apply the 'dark' class to the HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save preference to local storage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Export both the context and the provider using a single named export
export { ThemeContext, ThemeProvider };