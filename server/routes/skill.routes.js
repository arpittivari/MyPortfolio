// This file connects our skill controller logic to the API endpoints.

import express from 'express';
import {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
} from '../controllers/skill.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.route('/').get(getSkills);
router.route('/:id').get(getSkillById);

// Private (Admin) routes
router.route('/').post(protect, createSkill);
router.route('/:id').put(protect, updateSkill).delete(protect, deleteSkill);

export default router;
