import express from 'express';
import { handleAIChat } from '../controllers/ai.controller.js';

const router = express.Router();

/**
 * @route   POST /api/ai/chat
 * @desc    Handles a chat query for the AI assistant
 * @access  Public
 *
 * @body    {
 * "query": "What was the hardest part of this project?",
 * "contextType": "project", // or "blog" or "general"
 * "contextId": "60d5f1b2c3b4a0a1f8e1b2a3" // (Optional) The _id of the project/blog
 * }
 */
router.post('/chat', handleAIChat);

export default router;

