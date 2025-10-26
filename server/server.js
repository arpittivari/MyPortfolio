// server/server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
// Import routes...
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import skillRoutes from './routes/skill.routes.js';
import blogRoutes from './routes/blog.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import aiRoutes from './routes/ai.routes.js';
import contactRoutes from './routes/contact.routes.js';
// Import error middleware...
import { notFound, errorHandler } from './middleware/error.middleware.js';

dotenv.config();
connectDB();
const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
    'http://localhost:5173', // Your local frontend dev port
    'http://localhost:5174', // Your local frontend dev port (alternative)
    'https://my-portfolio-eta-beige-68.vercel.app' // Your DEPLOYED Vercel Frontend URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true // If you need cookies/sessions later
};

app.use(cors(corsOptions)); // Use configured CORS options
// --- End CORS Configuration ---


// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/contact', contactRoutes);

// Simple root route for testing deployment
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));