// server/routes/contact.routes.js

import express from 'express';
import { submitContactForm } from '../controllers/contact.controller.js';

const router = express.Router();

// Handle POST requests to /api/contact
router.route('/').post(submitContactForm);

export default router;