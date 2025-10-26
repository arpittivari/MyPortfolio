// This file connects our controller logic to the actual API endpoints.

import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/me', protect, getMe);

export default router;
