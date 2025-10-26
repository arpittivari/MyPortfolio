import React from 'react';
import { Link } from 'react-router-dom';
import { Waypoints, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center dark:bg-gray-900 bg-gray-50 text-center">
      <div className="p-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-700 max-w-md w-full">
        <Waypoints className="w-16 h-16 mx-auto mb-6 text-red-500 dark:text-red-400" />
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
          Resource Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The requested route is off-grid. Perhaps a bad routing configuration or a missing file on the server.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 dark:bg-pcb-green hover:bg-blue-700 dark:hover:bg-pcb-green-dark transition-colors duration-200"
        >
          <Home className="w-5 h-5 mr-2" />
          Return to Terminal
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
