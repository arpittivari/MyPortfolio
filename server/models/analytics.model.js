// server/models/analytics.model.js - SIMPLIFIED

import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project', // Link back to the Project model
  },
  // We can simplify - just record the timestamp of the view
}, { 
  timestamps: { createdAt: true, updatedAt: false } // Only record creation time
});

// Optional: Index projectId for faster lookups later
analyticsSchema.index({ projectId: 1 });

export default mongoose.model('Analytics', analyticsSchema);