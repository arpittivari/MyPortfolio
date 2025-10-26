import React from 'react';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 
                       bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center">
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Arpit Tiwari. Built with MERN, Tailwind, and a passion for Edge AI.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="https://github.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-pcb-green transition-colors duration-200"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com/in/yourusername" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-pcb-green transition-colors duration-200"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="mailto:your.email@example.com"
              className="text-gray-600 dark:text-gray-400 hover:text-pcb-green transition-colors duration-200"
              aria-label="Email Contact"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;