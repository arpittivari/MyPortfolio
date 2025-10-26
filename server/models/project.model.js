// server/models/project.model.js - CORRECTED SCHEMA (Final Version)

import mongoose from 'mongoose';

// Sub-schema for Engineering Decisions (Array of Objects)
const engineeringDecisionSchema = new mongoose.Schema({
  tool: { type: String, required: true, trim: true },
  reason: { type: String, required: true, trim: true },
});

// Sub-schema for Interactive Demo configuration
const interactiveDemoSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['None', 'IoT_Dashboard', 'ML_Game', 'AIChatBot'], // Allowed types
    default: 'None',
  },
  dataEndpoint: { type: String, trim: true }, // Optional endpoint for data
  githubLink: { type: String, trim: true }, // Optional link to demo code
});

// Main Project Schema
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Project slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      // REMOVED ENUM: Allows 'Embedded Systems' and other values from the form
    },
    shortDescription: {
      type: String,
      required: [true, 'Short description is required'],
      trim: true,
      maxLength: [250, 'Short description cannot exceed 250 characters'],
    },
    // CORRECTED: Use fullDescription, make it required
    fullDescription: {
      type: String,
      required: [true, 'Full description (Markdown) is required'],
    },
    repoUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      default: 'https://placehold.co/800x600/1f2937/a7f3d0?text=Project+Placeholder',
    },
    // CORRECTED: techStack is an array of simple Strings
    techStack: {
      type: [String],
      required: [true, 'Tech stack is required'],
      validate: [v => Array.isArray(v) && v.length > 0, 'Tech stack array cannot be empty']
    },
    // Uses the sub-schema defined above
    engineeringDecisions: {
        type: [engineeringDecisionSchema],
        default: []
    },
    isFeatured: { type: Boolean, default: false },
    // Uses the sub-schema defined above
    interactiveDemo: {
        type: interactiveDemoSchema,
        default: () => ({ type: 'None' })
    },
  },
  { timestamps: true }
);

// Remove mainDescription if it accidentally exists from old versions
// projectSchema.remove('mainDescription'); // Uncomment if needed

export default mongoose.model('Project', projectSchema);