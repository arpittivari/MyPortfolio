// server/models/skill.model.js

import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Category name is required'], // Add specific error message
    unique: true,
    trim: true,
  },
  skills: {
    type: [String], // Must be an array of strings
    required: [true, 'At least one skill is required'],
    validate: [v => Array.isArray(v) && v.length > 0, 'Skills array cannot be empty']
  },
}, { timestamps: true });

export default mongoose.model('Skill', SkillSchema);