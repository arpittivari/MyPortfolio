// server/controllers/skill.controller.js - CORRECTED FINAL VERSION

import asyncHandler from 'express-async-handler';
import Skill from '../models/skill.model.js'; // Ensure this model expects { category: String, skills: [String] }
import mongoose from 'mongoose'; // Needed for ID validation

/**
 * @desc    Create a new skill category with its skills
 * @route   POST /api/skills
 * @access  Private (Admin only)
 */
export const createSkill = asyncHandler(async (req, res) => {
  // DEBUG LOG: See what data is arriving from ManageSkills.jsx
  console.log('Received data for creating skill category:', req.body); 

  const { category, skills } = req.body; // Expects category (string) and skills (array of strings)

  // Validation
  if (!category || !skills || !Array.isArray(skills) || skills.length === 0) {
      res.status(400);
      throw new Error('Invalid data: Category and a non-empty skills array are required.');
  }

  const skillCategoryExists = await Skill.findOne({ category });
  if (skillCategoryExists) {
    res.status(400);
    throw new Error(`Skill category '${category}' already exists`);
  }

  try {
      const skillCategory = await Skill.create({ category, skills });
      res.status(201).json(skillCategory);
  } catch (error) {
      console.error("Error creating skill category:", error); // Log Mongoose error
      res.status(400); 
      throw new Error('Failed to create skill category: ' + error.message);
  }
});

/**
 * @desc    Get all skill categories
 * @route   GET /api/skills
 * @access  Public (Used by About page)
 */
export const getSkills = asyncHandler(async (req, res) => {
  // Fetches all documents (each representing a category)
  const skillCategories = await Skill.find({}); 
  res.json(skillCategories);
});

/**
 * @desc    Get a single skill category by ID
 * @route   GET /api/skills/:id
 * @access  Private (Could be public if needed)
 */
export const getSkillById = asyncHandler(async (req, res) => {
    const skillCategoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(skillCategoryId)) {
        res.status(400);
        throw new Error('Invalid Skill Category ID');
    }

    const skillCategory = await Skill.findById(skillCategoryId);

    if (skillCategory) {
        res.json(skillCategory);
    } else {
        res.status(404);
        throw new Error('Skill category not found');
    }
});


/**
 * @desc    Update a skill category
 * @route   PUT /api/skills/:id
 * @access  Private (Admin only)
 */
export const updateSkill = asyncHandler(async (req, res) => {
  const skillCategoryId = req.params.id;
  
  // DEBUG LOG: See what data is arriving for update
  console.log(`Received data for updating skill category ${skillCategoryId}:`, req.body); 

  const { category, skills } = req.body;

  // Validation
  if (!mongoose.Types.ObjectId.isValid(skillCategoryId)) {
      res.status(400);
      throw new Error('Invalid Skill Category ID');
  }
  if (!category || !skills || !Array.isArray(skills) || skills.length === 0) {
      res.status(400);
      throw new Error('Invalid data: Category and a non-empty skills array are required.');
  }
  
  const skillCategory = await Skill.findById(skillCategoryId);
  if (!skillCategory) {
    res.status(404);
    throw new Error('Skill category not found');
  }

  // Check if updating category name conflicts
  if (category !== skillCategory.category) {
      const existingCategory = await Skill.findOne({ category, _id: { $ne: skillCategoryId } });
      if (existingCategory) {
          res.status(400);
          throw new Error(`Cannot rename category to '${category}', as it already exists.`);
      }
  }

  skillCategory.category = category;
  skillCategory.skills = skills;

  try {
      const updatedSkillCategory = await skillCategory.save();
      res.json(updatedSkillCategory);
  } catch (error) {
      console.error("Error updating skill category:", error); // Log Mongoose error
      res.status(400);
      throw new Error('Failed to update skill category: ' + error.message);
  }
});

/**
 * @desc    Delete a skill category
 * @route   DELETE /api/skills/:id
 * @access  Private (Admin only)
 */
export const deleteSkill = asyncHandler(async (req, res) => {
    const skillCategoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(skillCategoryId)) {
        res.status(400);
        throw new Error('Invalid Skill Category ID');
    }

    const skillCategory = await Skill.findById(skillCategoryId);

    if (skillCategory) {
        await Skill.deleteOne({ _id: skillCategoryId }); // Use deleteOne with filter
        res.json({ message: 'Skill category removed' });
    } else {
        res.status(404);
        throw new Error('Skill category not found');
    }
});

// Note: No need for a final export block if using 'export const' above