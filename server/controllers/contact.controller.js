// server/controllers/contact.controller.js

import asyncHandler from 'express-async-handler';
import ContactMessage from '../models/contactMessage.model.js'; // Import the model

/**
 * @desc    Handle contact form submission
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    res.status(400);
    throw new Error('Name, email, and message are required.');
  }

  try {
    // Option 1: Save to Database (Recommended)
    const newMessage = await ContactMessage.create({ name, email, message });
    console.log('--- Contact Message Received & Saved ---');
    console.log('From:', name, email);
    console.log('Message:', message.substring(0, 100) + '...'); // Log snippet

    // Option 2: Just log it (if you don't want to save to DB)
    // console.log('--- Contact Message Received ---');
    // console.log('From:', name, email);
    // console.log('Message:', message);

    // Send success response to frontend
    res.status(201).json({ success: true, message: 'Message received successfully!' });

  } catch (error) {
    console.error('--- Contact Form Submission Error ---');
    console.error(error);
    res.status(400); // Send Bad Request if validation fails
    throw new Error(`Failed to process message: ${error.message}`);
  }
});