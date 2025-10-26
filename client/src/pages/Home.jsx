import React from 'react';
import Terminal from '../components/features/Terminal/Terminal.jsx';
import { LayoutGrid } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] p-4">
      <div className="w-full max-w-4xl h-full">
        <h2 className="flex items-center text-xl font-bold mb-4 
                       text-gray-900 dark:text-gray-100 
                       border-b pb-2 border-gray-300 dark:border-gray-700">
          <LayoutGrid className="w-5 h-5 mr-2 text-pcb-green" />
          System Console / Welcome
        </h2>
        <Terminal />
      </div>
    </div>
  );
};

export default Home;