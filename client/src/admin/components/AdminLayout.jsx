import React from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Code, BookOpen, LogOut, Settings, BarChart3, Users, Home } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import ThemeToggle from '../../components/layout/ThemeToggle.jsx';

// Navigation links for the Admin Sidebar
const adminNavItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Manage Projects', path: '/admin/projects', icon: Code },
  { name: 'Manage Skills', path: '/admin/skills', icon: Settings },
  { name: 'Manage Blog', path: '/admin/blog', icon: BookOpen },
  { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
];

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 dark:bg-gray-800 flex flex-col shadow-xl flex-shrink-0">
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-xl font-bold text-pcb-green-light flex items-center">
            <Users className="w-5 h-5 mr-2 text-pcb-green" /> Admin Panel
          </h1>
          <ThemeToggle />
        </div>

        <nav className="flex-grow p-4 space-y-2">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors duration-200 
                ${isActive 
                  ? 'bg-pcb-green text-gray-900 shadow-md' 
                  : 'text-gray-300 hover:bg-gray-700'}`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
           <div className="p-4 border-t border-gray-700 space-y-3"> 
          <Link
            to="/" // Link to the public home page
            className="flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors duration-200 text-gray-300 hover:bg-gray-700"
            target="_blank" // Optional: Open in new tab
            rel="noopener noreferrer" // Required with target="_blank"
          >
            <Home className="w-5 h-5" />
            <span>View Public Site</span>
          </Link>
        
          
          <Button 
            onClick={handleLogout} 
            variant="danger" 
            className="w-full"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;