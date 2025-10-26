// client/src/admin/pages/Dashboard.jsx

import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Code, BookOpen, Eye, Zap, AlertTriangle, BarChart3, Settings } from 'lucide-react';
import api from '../../services/api.js';
import Loader from '../../components/ui/Loader.jsx';
import AnalyticsCard from '../components/AnalyticsCard.jsx';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch combined analytics from the protected backend endpoint
        const response = await api.get('/analytics'); 
        setAnalytics(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard analytics:", err);
        setError("Could not load dashboard data. Check the server or your authentication.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader size="w-10 h-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg flex items-center space-x-3 text-red-700 dark:text-red-300">
        <AlertTriangle className="w-5 h-5" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  // Fallback for missing data
  const data = analytics || { totalViews: 0, projectCount: 0, blogCount: 0, lastLogin: 'N/A' };

  // Prepare cards based on fetched data
  const cards = [
    { title: 'Total Project Views', value: data.totalViews, Icon: Eye },
    { title: 'Total Projects', value: data.projectCount, Icon: Code },
    { title: 'Total Blog Posts', value: data.blogCount, Icon: BookOpen },
    { title: 'Last Login', value: data.lastLogin || 'N/A', Icon: Zap, isDate: true },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
        <LayoutDashboard className="w-6 h-6 mr-2 text-pcb-green" /> Dashboard Overview
      </h1>
      
      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <AnalyticsCard
            key={index}
            title={card.title}
            value={card.isDate ? new Date(card.value).toLocaleString() : card.value}
            Icon={card.Icon}
          />
        ))}
      </div>

      {/* Quick Links / Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity Placeholder */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Recent Activity</h2>
          <ul className="text-sm space-y-3 text-gray-600 dark:text-gray-400">
            <li><span className="text-pcb-green">[1h ago]</span> Project 'Edge AI Monitor' updated.</li>
            <li><span className="text-pcb-green">[3h ago]</span> New message received via contact form.</li>
            <li><span className="text-pcb-green">[1d ago]</span> Blog Post 'TinyML: Optimizing for MCU' published.</li>
            <li className="text-center pt-4">...</li>
          </ul>
        </div>
        
        {/* Quick Links to Management Pages */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <QuickLinkButton to="/admin/projects" text="New Project" Icon={Code} />
            <QuickLinkButton to="/admin/blog" text="New Blog Post" Icon={BookOpen} />
            <QuickLinkButton to="/admin/skills" text="Update Skills" Icon={Settings} />
            <QuickLinkButton to="/admin/analytics" text="View Details" Icon={BarChart3} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple reusable button for the quick links
const QuickLinkButton = ({ to, text, Icon }) => (
  <Link to={to} className="flex flex-col items-center justify-center p-4 rounded-lg
                           bg-gray-50 dark:bg-gray-700/50 hover:bg-pcb-green/20
                           dark:hover:bg-pcb-green/10 transition-colors duration-200 text-center">
    <Icon className="w-6 h-6 mb-2 text-pcb-green" />
    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{text}</span>
  </Link>
);

export default Dashboard;