import React from 'react';
import { Github, Linkedin, Mail, Youtube } from 'lucide-react'; // Ensure Youtube is imported

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 
                       bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center text-center">
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Arpit Tiwari. Built with MERN, Tailwind, and a passion for Edge AI.
          </p>
          
          {/* Social Links Updated */}
          <div className="flex space-x-6 mt-4 md:mt-0">
            {/* Email Link */}
            <a 
              href="mailto:arpittiwari7549@gmail.com"
              className="text-gray-600 dark:text-gray-400 hover:text-pcb-green transition-colors duration-200"
              aria-label="Email Contact"
            >
              <Mail className="w-5 h-5" />
            </a>
            
            {/* GitHub Link */}
            <a 
              href="https://github.com/arpittivari" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-pcb-green transition-colors duration-200"
              aria-label="GitHub Profile"
            >
              <Github className="w-5 h-5" />
            </a>
            
            {/* LinkedIn Link */}
            <a 
              href="https://www.linkedin.com/in/arpit-tiwari-08b177271" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-pcb-green transition-colors duration-200"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            
            {/* YouTube Link - New */}
            <a 
              href="https://www.youtube.com/@arpittiwari_15" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-600 dark:text-gray-400 hover:text-pcb-green transition-colors duration-200"
              aria-label="YouTube Channel"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;