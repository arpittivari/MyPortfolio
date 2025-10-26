// client/src/admin/pages/Analytics.jsx

import React, { useEffect, useState } from 'react';
import { BarChart3, Eye, Code, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react';
import api from '../../services/api.js';
import Loader from '../../components/ui/Loader.jsx';

const Analytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        // Fetch detailed analytics (project views, counts) from the protected endpoint
        // NOTE: This endpoint aggregates view counts from the analytics.model.js
        const response = await api.get('/analytics/details'); 
        
        // Data cleanup: Calculate total views and sort for ranking
        const sortedData = response.data.map(item => ({
            ...item,
            totalViews: item.viewCount || 0, // Ensure viewCount exists
        })).sort((a, b) => b.totalViews - a.totalViews); // Sort by views descending

        setData(sortedData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch detailed analytics:", err);
        setError("Could not load detailed analytics. Ensure projects have views or the API is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const totalViews = data.reduce((sum, item) => sum + item.totalViews, 0);

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

 // client/src/admin/pages/Analytics.jsx

// ... (Keep imports, state, useEffect, loading/error logic)

  return (
    <div className="space-y-8">
      {/* Header - Already responsive */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
        <BarChart3 className="w-6 h-6 mr-2 text-pcb-green" /> Detailed Analytics
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 border-b pb-4">
        Track project performance and audience engagement.
      </p>

      {/* Summary Card - Already responsive */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Portfolio Total Metrics
        </p>
        {/* Responsive layout for summary numbers */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-2 sm:space-y-0">
            <div className="flex items-center text-lg sm:text-xl font-bold">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-pcb-green" />
                Total Views: <span className="ml-2 text-2xl sm:text-3xl text-gray-900 dark:text-gray-100">{totalViews.toLocaleString()}</span>
            </div>
            <div className="flex items-center text-lg sm:text-xl font-bold">
                <Code className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-pcb-green" />
                Total Projects: <span className="ml-2 text-2xl sm:text-3xl text-gray-900 dark:text-gray-100">{data.length}</span>
            </div>
        </div>
      </div>

      {/* --- Project Ranking Section - RESPONSIVE --- */}
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100 flex items-center">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-red-500" /> Top Project Rankings
        </h2>

        {/* --- TABLE: Visible on Medium Screens and Up --- */}
        <div className="overflow-x-auto hidden md:block"> {/* Hide on small, show on medium+ */}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="admin-th w-[5%]">Rank</th>
                <th className="admin-th w-[40%] text-left">Project Title</th>
                <th className="admin-th w-[15%] text-left">Category</th>
                <th className="admin-th w-[15%] text-right">Views</th>
                <th className="admin-th w-[25%]">Popularity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.length > 0 ? (
                data.map((item, index) => {
                    const maxViews = data[0].totalViews || 1;
                    const popularityWidth = Math.min(100, (item.viewCount / maxViews) * 100); // Use viewCount
                    return (
                        <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                          <td className="admin-td font-extrabold text-lg text-center">{index + 1}</td>
                          <td className="admin-td font-medium text-left">{item.title}</td>
                          <td className="admin-td text-sm text-left">{item.category}</td>
                          <td className="admin-td text-right font-bold text-pcb-green-dark dark:text-pcb-green">
                            {item.viewCount.toLocaleString()}
                          </td>
                          <td className="admin-td">
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                              <div 
                                className="bg-pcb-green h-2.5 rounded-full transition-all duration-500" 
                                style={{ width: `${popularityWidth}%` }}
                              ></div>
                            </div>
                          </td>
                        </tr>
                    );
                })
              ) : (
                <tr><td colSpan="5" className="admin-td text-center text-gray-500 py-6">No projects or view data available.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* --- CARD LIST: Visible on Small Screens Only --- */}
        <div className="space-y-4 md:hidden"> {/* Show on small, hide on medium+ */}
           {data.length > 0 ? (
                data.map((item, index) => {
                    const maxViews = data[0].totalViews || 1;
                    const popularityWidth = Math.min(100, (item.viewCount / maxViews) * 100); // Use viewCount
                    return (
                        <div key={item._id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg shadow border-l-4 border-pcb-green">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-gray-500 dark:text-gray-400">RANK #{index + 1}</span>
                                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-pcb-green/10 text-pcb-green-dark dark:bg-pcb-green-dark/30 dark:text-pcb-green-light">
                                    {item.category}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{item.title}</h3>
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Views:</span>
                                <span className="font-bold text-pcb-green">{item.viewCount.toLocaleString()}</span>
                            </div>
                             <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div 
                                className="bg-pcb-green h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${popularityWidth}%` }}
                              ></div>
                            </div>
                        </div>
                    );
                })
           ) : (
                <div className="text-center text-gray-500 py-6">No projects or view data available.</div>
           )}
        </div>

      </div> 
    </div>
  );
};

export default Analytics;