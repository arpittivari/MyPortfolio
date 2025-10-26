// server/middleware/error.middleware.js - CORRECTED EXPORTS

import asyncHandler from 'express-async-handler'; // Ensure asyncHandler is installed if used

// Middleware for 404 Not Found errors
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Pass the error to the next middleware (errorHandler)
};

// General error handling middleware (MUST be the last middleware used)
export const errorHandler = (err, req, res, next) => {
  // Determine status code: use error's status code or default to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  console.error("--- Global Error Handler ---"); // Log the error on the server
  console.error("Status Code:", statusCode);
  console.error("Error:", err.message);
  // console.error("Stack:", process.env.NODE_ENV === 'production' ? null : err.stack); // Optionally hide stack in production

  // Send JSON response to the client
  res.json({
    message: err.message,
    // Only include stack trace in development mode for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

// NOTE: No final export block needed as functions are exported individually above.