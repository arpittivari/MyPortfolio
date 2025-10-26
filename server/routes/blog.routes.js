// server/routes/blog.routes.js - CORRECTED IMPORTS AND ROUTES

import express from 'express';
// Assuming your auth middleware is named 'protect'
import { protect } from '../middleware/auth.middleware.js'; 
import {
  // CRITICAL FIX: Use the correct function name from the controller
  createBlogPost, 
  getBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost
} from '../controllers/blog.controller.js';

const router = express.Router();

// --- Public Routes ---
// GET /api/blog (Get all posts for the public blog page)
router.route('/').get(getBlogPosts); 
// GET /api/blog/:slug (Get a single post by its slug)
router.route('/:slug').get(getBlogPostBySlug);

// --- Private (Admin) Routes ---
// POST /api/blog (Create a new post - Protected)
router.route('/').post(protect, createBlogPost); 
// PUT /api/blog/:slug (Update a post - Protected)
router.route('/:slug').put(protect, updateBlogPost);
// DELETE /api/blog/:slug (Delete a post - Protected)
router.route('/:slug').delete(protect, deleteBlogPost);

export default router;