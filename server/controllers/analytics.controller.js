// server/controllers/analytics.controller.js - CORRECTED FINAL VERSION

import asyncHandler from 'express-async-handler';
import Analytics from '../models/analytics.model.js';
import Project from '../models/project.model.js';
import Blog from '../models/blog.model.js'; // Import Blog model for count
import mongoose from 'mongoose';

/**
 * @desc    Log a view for a project (called by project.controller)
 * @route   POST /api/analytics/track
 * @access  Public
 */
export const trackProjectView = asyncHandler(async (req, res) => {
  const { projectId } = req.body;

  if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
    res.status(400);
    throw new Error('Invalid Project ID provided for tracking.');
  }

  // Create a new analytics entry (We track every single view as a separate document)
  const view = new Analytics({
    projectId: projectId,
    // Add type if your Analytics model uses it, otherwise simple view count
  });

  await view.save();

  res.status(200).json({ message: 'View tracked' });
});


/**
 * @desc    Get dashboard summary (Total views, Project count, etc.)
 * @route   GET /api/analytics
 * @access  Private (Admin only)
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
  // Aggregate total views (using the correct model name 'Analytics')
  const totalViewsResult = await Analytics.aggregate([
    { $group: { _id: null, totalViews: { $sum: '$views' } } },
  ]);
  
  const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;
  
  // Get content counts
  const projectCount = await Project.countDocuments();
  const blogCount = await Blog.countDocuments(); 

  // NOTE: You would typically get the last login time from the User model,
  // but we use the current date as a placeholder.
  const lastLogin = new Date().toISOString(); 

  res.status(200).json({
    totalViews,
    projectCount,
    blogCount,
    lastLogin,
  });
});


/**
 * @desc    Get detailed project ranking data
 * @route   GET /api/analytics/details
 * @access  Private (Admin only)
 */
export const getDetailedAnalytics = asyncHandler(async (req, res) => {
    console.log("--- Fetching Detailed Analytics ---"); // DEBUG LOG
    // 1. Group by projectId and count views (COUNT DOCUMENTS)
    const aggregatedViews = await Analytics.aggregate([
        {
            $group: {
                _id: '$projectId', // Group by the project ID
                viewCount: { $sum: 1 }, // CORRECT: Count the documents for each project ID
            },
        },
    ]);
    console.log("Aggregated Views:", aggregatedViews); // DEBUG LOG

    // 2. Join with Project details (No change needed here)
    const projectIds = aggregatedViews.map(item => item._id);
    const projects = await Project.find({ _id: { $in: projectIds } }).select('title slug category');
    
    // 3. Combine views and project details (No change needed here)
    const detailedData = projects.map(project => {
        const viewData = aggregatedViews.find(view => view._id.equals(project._id));
        return {
            _id: project._id,
            title: project.title,
            slug: project.slug,
            category: project.category,
            viewCount: viewData ? viewData.viewCount : 0, // Use the count
        };
    }).sort((a, b) => b.viewCount - a.viewCount); 

    console.log("Detailed Data Sent:", detailedData); // DEBUG LOG
    res.status(200).json(detailedData);
});