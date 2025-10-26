import React, { useEffect, useState } from 'react';
import SkillCard from '../components/ui/SkillCard.jsx';
import api from '../services/api.js';
import Loader from '../components/ui/Loader.jsx';
import { User, Code, AlertTriangle, Briefcase } from 'lucide-react';

const About = () => {
  // CRITICAL FIX: Initialize skills to an empty array to prevent .length error
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        const response = await api.get('/skills');
        
        // Ensure the response data is an array before setting state
        if (Array.isArray(response.data)) {
            setSkills(response.data);
        } else {
            setSkills([]); // Fallback to empty array if API returns null/object
        }
        setError(null);
      } catch (err) {
        console.error("Failed to fetch skills:", err);
        setError("Could not load skills. Please check if the backend server is running and data exists.");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Bio and Summary Section */}
      <div className="mb-12 border-b dark:border-gray-700 pb-8">
        <h1 className="text-4xl font-extrabold mb-4 
                       text-gray-900 dark:text-gray-100 flex items-center">
          <User className="w-8 h-8 mr-2 text-pcb-green" />
          Arpit Tiwari: ECE Engineer
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          Full-Stack MERN Developer specializing in Embedded Systems, IoT architecture, and high-performance Edge AI model deployment.
        </p>
        
        <div className="space-y-4 text-gray-700 dark:text-gray-300">
            <p>
                My passion lies at the intersection of hardware and intelligence, solving real-world latency and resource constraints by optimizing software for low-power microcontrollers. I hold a deep understanding of bare-metal programming, RTOS management (FreeRTOS, Zephyr), and designing robust RESTful APIs to handle massive sensor data streams.
            </p>
            <p className="flex items-center text-lg font-semibold">
                <Briefcase className="w-5 h-5 mr-2 text-pcb-green" />
                Seeking roles in Firmware Engineering, IoT Platform Development, or TinyML.
            </p>
        </div>
      </div>
      
      {/* Technical Skills Section */}
      <h2 className="text-3xl font-bold mb-8 
                     text-gray-900 dark:text-gray-100 flex items-center">
        <Code className="w-6 h-6 mr-2 text-pcb-green" />
        Technical Expertise
      </h2>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loader size="w-8 h-8" />
          <span className="ml-3 text-lg">Loading skill data...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg flex items-center space-x-3 text-red-700 dark:text-red-300">
          <AlertTriangle className="w-5 h-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* CRITICAL FIX APPLIED: Check if skills array exists and has length */}
      {skills && skills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skills.map((skill) => (
            <SkillCard key={skill._id} skillCategory={skill} />
          ))}
        </div>
      )}

      {/* Display if no skills are found after loading */}
      {!loading && (!skills || skills.length === 0) && !error && (
          <div className="text-center py-12 bg-gray-900/20 rounded-xl border border-dashed border-gray-700">
              <p className="text-lg font-medium text-gray-400">
                  No skill categories found. Please add content in the Admin panel.
              </p>
          </div>
      )}
    </div>
  );
};

export default About;