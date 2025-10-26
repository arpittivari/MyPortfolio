// server/controllers/project.controller.js - FINAL VERSION WITH LOGGING & SLUG

import asyncHandler from 'express-async-handler';
import Project from '../models/project.model.js';
import Analytics from '../models/analytics.model.js';
import mongoose from 'mongoose'; // Needed for validation if checking IDs manually

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private (Admin only)
 */
export const createProject = asyncHandler(async (req, res) => {
  // DEBUG LOG 1: Log incoming data
  console.log('--- Attempting to Create Project ---');
  console.log('Received Body:', req.body);

  const { slug } = req.body; // Check slug specifically for uniqueness

  // Check if required fields are present (add more as needed based on your model)
  if (!req.body.title || !slug || !req.body.category || !req.body.shortDescription || !req.body.fullDescription || !req.body.techStack) {
      res.status(400);
      throw new Error('Missing required project fields.');
  }

  const projectExists = await Project.findOne({ slug });
  if (projectExists) {
    res.status(400);
    throw new Error(`Project with slug '${slug}' already exists.`);
  }

  // Create a new project instance using the request body
  const project = new Project({
    ...req.body,
    // Add any transformations needed, e.g., ensuring arrays are arrays
    techStack: Array.isArray(req.body.techStack) ? req.body.techStack : [],
    engineeringDecisions: Array.isArray(req.body.engineeringDecisions) ? req.body.engineeringDecisions : [],
  });

  try {
    // DEBUG LOG 2: Log right before saving
    console.log('Data validated, attempting project.save()...');

    const createdProject = await project.save(); // Attempt to save

    // DEBUG LOG 3: Log if save was successful
    console.log('project.save() successful, Project ID:', createdProject._id);

    res.status(201).json(createdProject); // Send back the created project

  } catch (error) {
    // CRITICAL: Log the detailed Mongoose error if save() fails
    console.error('--- Project Save Failed ---');
    console.error('Mongoose Error:', error); // Log the full error object
    res.status(400); // Mongoose validation errors are typically 400 Bad Request
    throw new Error(`Failed to save project: ${error.message}`);
  }
});

/**
 * @desc    Get all projects (excluding full description for list view)
 * @route   GET /api/projects
 * @access  Public
 */
export const getProjects = asyncHandler(async (req, res) => {
  console.log('--- Fetching All Projects ---'); // DEBUG LOG
  try {
      // Select fields, excluding the large markdown content for performance
      const projects = await Project.find({}).select('-fullDescription -engineeringDecisions').sort({ createdAt: -1 });
      console.log(`Found ${projects.length} projects.`); // DEBUG LOG
      res.json(projects);
  } catch(error) {
      console.error("Error fetching projects:", error);
      res.status(500);
      throw new Error('Server error fetching projects.');
  }
});

/**
 * @desc    Get a single project by its slug
 * @route   GET /api/projects/:slug  (CORRECTED: Uses slug)
 * @access  Public
 */
export const getProjectBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  console.log(`--- Fetching Project by Slug: ${slug} ---`); 

  const project = await Project.findOne({ slug: slug });

  if (project) {
    console.log('Project found:', project.title); 
    
    // --- CRITICAL VIEW TRACKING ---
    try {
        console.log(`Attempting to track view for projectId: ${project._id}`); // DEBUG LOG
        // Use await here to ensure it tries before responding (though errors are caught)
        await Analytics.create({ projectId: project._id }); 
        console.log(`View tracked successfully for projectId: ${project._id}`); // DEBUG LOG
    } catch (err) {
        // Log the error but don't stop the user from seeing the project
        console.error('Analytics tracking failed silently:', err.message); 
    }
    // --- END VIEW TRACKING ---

    res.json(project); // Send project data regardless of tracking success
  } else {
    console.log('Project not found by slug.'); 
    res.status(404);
    throw new Error('Project not found');
  }
});
/**
 * @desc    Update a project by its slug
 * @route   PUT /api/projects/:slug (CORRECTED: Uses slug)
 * @access  Private (Admin only)
 */
export const updateProject = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  console.log(`--- Attempting to Update Project: ${slug} ---`); // DEBUG LOG
  console.log('Update Data:', req.body); // DEBUG LOG

  const project = await Project.findOne({ slug: slug });

  if (project) {
    // Overwrite fields with new data from req.body
    // Be careful with Object.assign, ensure it doesn't overwrite unintended fields like _id
    const updateData = { ...req.body };
    delete updateData._id; // Prevent trying to update the immutable _id

    // Check if slug is being changed and if the new slug exists
    if (updateData.slug && updateData.slug !== slug) {
        const slugExists = await Project.findOne({ slug: updateData.slug });
        if (slugExists) {
            res.status(400);
            throw new Error(`Cannot change slug to '${updateData.slug}', it already exists.`);
        }
    }

    Object.assign(project, updateData); // Apply updates

    try {
        const updatedProject = await project.save(); // Attempt to save updates
        console.log('Project updated successfully.'); // DEBUG LOG
        res.json(updatedProject);
    } catch (error) {
        console.error('--- Project Update Failed ---');
        console.error('Mongoose Error:', error); // Log the full error object
        res.status(400);
        throw new Error(`Failed to update project: ${error.message}`);
    }
  } else {
    console.log('Project not found for update.'); // DEBUG LOG
    res.status(404);
    throw new Error('Project not found');
  }
});

/**
 * @desc    Delete a project by its slug
 * @route   DELETE /api/projects/:slug (CORRECTED: Uses slug)
 * @access  Private (Admin only)
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  console.log(`--- Attempting to Delete Project: ${slug} ---`); // DEBUG LOG

  const project = await Project.findOne({ slug: slug });

  if (project) {
    await Project.deleteOne({ slug: slug }); // Delete based on slug
    // Optionally: Delete related Analytics data
    await Analytics.deleteMany({ projectId: project._id });
    console.log('Project deleted successfully.'); // DEBUG LOG
    res.json({ message: 'Project removed' });
  } else {
    console.log('Project not found for deletion.'); // DEBUG LOG
    res.status(404);
    throw new Error('Project not found');
  }
});

// Note: No final export block needed if using 'export const' above