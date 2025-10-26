import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { useTheme } from '../../hooks/useTheme';

/**
 * The main layout container for the public-facing application.
 * It sets the theme class on the main div and includes the Navbar and Footer.
 */
const Layout = () => {
  const { theme } = useTheme();

  return (
    // The "dark" class is applied to the root element in ThemeContext, 
    // but applying transition here ensures the background of the *Layout* transitions.
    <div 
      className={`min-h-screen flex flex-col transition-colors duration-300 
                  ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}
    >
      <Navbar />

      {/* Main Content Area - Renders the current page using Outlet */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;