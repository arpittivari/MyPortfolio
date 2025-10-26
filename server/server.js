import express from 'express';
import colors from 'colors';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/error.middleware.js';
import contactRoutes from './routes/contact.routes.js';
// --- Import Routes ---
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import skillRoutes from './routes/skill.routes.js';
import blogRoutes from './routes/blog.routes.js';
import aiRoutes from './routes/ai.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

// --- Load Environment Variables ---
dotenv.config();

// --- Connect to Database ---
connectDB();

// --- Initialize Express App ---
const app = express();

// --- Middleware ---
// Enable CORS
app.use(cors());
// Body parser for JSON
app.use(express.json());
// Body parser for URL-encoded data
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/contact', contactRoutes);
// --- Health Check Route ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is healthy' });
});

// --- Central Error Handler ---
// This MUST be after all the routes
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  );
});

