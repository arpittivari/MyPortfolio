import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import { useAuth } from '../../hooks/useAuth';
import { Code, LogOut } from 'lucide-react';

const Navbar = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills & Bio', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-lg backdrop-blur-md 
                       bg-white/80 dark:bg-gray-900/80 
                       transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo / Title */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold text-gray-900 dark:text-pcb-green-light">
            <Code className="w-6 h-6 text-pcb-green" />
            <span>Arpit.dev</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-600 dark:text-gray-300 hover:text-pcb-green dark:hover:text-pcb-green transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Controls (Theme, Admin) */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {auth.isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to="/admin/login"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-pcb-green dark:hover:text-pcb-green transition-colors duration-200 hidden sm:block"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;