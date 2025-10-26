// This holds the logic for our authentication routes.

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.model.js'; // Imports the Model (which includes bcrypt logic)

// --- Helper Function to Generate JWT ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // Token will be valid for 30 days
  });
};

/**
 * @desc    Register a new admin user
 * @route   POST /api/auth/register
 * @access  Public (for now, to create the first admin)
 */

/**
 * @desc    Authenticate (login) an admin user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find the user by email
  const user = await User.findOne({ email });

  // 2. Check if user exists AND the password matches using the Model's method (user.matchPassword)
  if (user && (await user.matchPassword(password))) {
    
    return res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
      message: 'Login successful', 
    });
  } else {
    // Fails if user not found or password mismatch
    res.status(401); // 401 Unauthorized is correct for login failure
    throw new Error('Invalid email or password');
  }
});

/**
 * @desc    Get current logged-in user's data
 * @route   GET /api/auth/me
 * @access  Private (protected by our 'protect' middleware)
 */
export const getMe = asyncHandler(async (req, res) => {
    // req.user is attached by the 'protect' middleware
    if (!req.user) {
        res.status(404);
        throw new Error('User not found after token validation');
    }
    res.status(200).json(req.user); 
});
