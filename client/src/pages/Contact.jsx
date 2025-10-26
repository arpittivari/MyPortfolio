import React, { useState } from 'react';
import { Mail, Send, Github, Linkedin, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import api from '../services/api.js';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null); // 'success', 'error', 'loading'
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('Sending message...');

    try {
      // The API call to the backend contact route
      await api.post('/contact', formData); 
      
      setStatus('success');
      setMessage('Message sent successfully! I will respond soon.');
      setFormData({ name: '', email: '', message: '' }); // Clear form
    } catch (err) {
      console.error('Contact form submission error:', err);
      setStatus('error');
      setMessage('Failed to send message. Please try again or contact me via LinkedIn.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-4 
                     text-gray-900 dark:text-gray-100 flex items-center">
        <Mail className="w-8 h-8 mr-2 text-pcb-green" />
        Get In Touch
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 border-b pb-4">
        I'm always open to discussing new projects, collaborations, or job opportunities.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact Form (2/3 width on desktop) */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Send a direct message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Status Message */}
            {status && (
              <div 
                className={`p-3 rounded-lg flex items-center space-x-3 text-sm font-medium ${
                  status === 'success' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                    : status === 'error' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                }`}
              >
                {status === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                <p>{message}</p>
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                           focus:ring-pcb-green focus:border-pcb-green outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                           focus:ring-pcb-green focus:border-pcb-green outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                           focus:ring-pcb-green focus:border-pcb-green outline-none resize-none"
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full md:w-auto flex items-center justify-center space-x-2 
                         px-6 py-3 rounded-lg font-semibold 
                         bg-pcb-green text-gray-900 hover:bg-pcb-green-dark 
                         transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-4 text-gray-600 dark:text-gray-400">
  <div className="flex items-center space-x-3">
    <Mail className="w-5 h-5 flex-shrink-0 text-pcb-green" />
    <span className="text-gray-700 dark:text-gray-300">arpittiwari7549@gmail.com</span>
  </div>
  <div className="flex items-center space-x-3">
    <Linkedin className="w-5 h-5 flex-shrink-0 text-pcb-green" />
    <a 
      href="https://www.linkedin.com/in/arpit-tiwari-08b177271" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="hover:text-pcb-green-dark"
    >
      LinkedIn Profile
    </a>
  </div>
  <div className="flex items-center space-x-3">
    <Github className="w-5 h-5 flex-shrink-0 text-pcb-green" />
    <a 
      href="https://github.com/arpittivari" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="hover:text-pcb-green-dark"
    >
      GitHub Repositories
              </a>
             </div>
           </div>
          
        </div>
      </div>
  );
};

export default Contact;