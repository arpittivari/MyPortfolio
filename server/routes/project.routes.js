// server/routes/project.routes.js - FINAL CORRECTED ROUTES

import express from 'express';
// Assuming your auth middleware is named 'protect'
import { protect } from '../middleware/auth.middleware.js'; 
import {
  createProject,
  getProjects,
  getProjectBySlug, // Uses slug
  updateProject,    // Uses slug
  deleteProject     // Uses slug
} from '../controllers/project.controller.js';

const router = express.Router();

// --- Public Routes ---
// GET /api/projects (Get all projects)
router.route('/').get(getProjects); 
// GET /api/projects/:slug (Get a single project by slug) - CORRECT
router.route('/:slug').get(getProjectBySlug); 

// --- Private (Admin) Routes ---
// POST /api/projects (Create a new project - Protected)
router.route('/').post(protect, createProject); 
// PUT /api/projects/:slug (Update project by slug - Protected) - CORRECTED
router.route('/:slug').put(protect, updateProject); 
// DELETE /api/projects/:slug (Delete project by slug - Protected) - CORRECTED
router.route('/:slug').delete(protect, deleteProject); 

export default router;