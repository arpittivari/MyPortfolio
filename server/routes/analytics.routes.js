// server/routes/analytics.routes.js - CORRECTED IMPORTS AND ROUTES

import express from 'express';
// Note: Assuming your auth.middleware.js exports a function named 'protect'
import { protect } from '../middleware/auth.middleware.js'; 
import {
    // FIX 1: Update name from trackView to trackProjectView
    trackProjectView, 
    // FIX 2: Update name from getAnalytics to getDashboardSummary
    getDashboardSummary,
    // FIX 3: Update name from getAnalyticsSummary to getDetailedAnalytics
    getDetailedAnalytics,
} from '../controllers/analytics.controller.js';

const router = express.Router();

// Public route to track a view
// POST /api/analytics/track
router.route('/track').post(trackProjectView);

// Private (Admin) routes to get analytics data
// FIX 4: This is the dashboard summary. GET /api/analytics/
router.route('/').get(protect, getDashboardSummary);

// FIX 5: This is the detailed ranking table. GET /api/analytics/details
router.route('/details').get(protect, getDetailedAnalytics);


export default router;