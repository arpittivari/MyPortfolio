// A central middleware to handle all thrown errors.
// This ensures we always send a clean JSON response, not an HTML error page.

const errorHandler = (err, req, res, next) => {
  // If a status code is already set, use it. Otherwise, default to 500 (Server Error).
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);
  res.json({
    message: err.message,
    // Only show the stack trace if we are not in 'production' mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { errorHandler };
