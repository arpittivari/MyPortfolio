// server/controllers/blog.controller.js - WITH ENHANCED LOGGING

import asyncHandler from 'express-async-handler';
import Blog from '../models/blog.model.js';
import mongoose from 'mongoose';

/**
 * @desc    Create a new blog post
 * @route   POST /api/blog
 * @access  Private (Admin only)
 */
export const createBlogPost = asyncHandler(async (req, res) => {
  // DEBUG LOG 1: Log incoming data
  console.log('--- Attempting to Create Blog Post ---');
  console.log('Received Body:', req.body);

  const { title, slug, category, excerpt, markdownContent } = req.body;

  // Basic validation (more happens at schema level)
  if (!title || !slug || !category || !excerpt || !markdownContent) {
    res.status(400);
    throw new Error('All fields are required for blog post.');
  }

  const postExists = await Blog.findOne({ slug });
  if (postExists) {
    res.status(400);
    throw new Error(`Blog post with slug '${slug}' already exists.`);
  }

  try {
    // DEBUG LOG 2: Log right before creating
    console.log('Data validated, attempting Blog.create()...');

    const post = await Blog.create({
      title,
      slug,
      category,
      excerpt,
      markdownContent,
      // author: req.user._id // Optional: Link to the logged-in admin user
    });

    // DEBUG LOG 3: Log if create was successful
    console.log('Blog.create() successful, Post ID:', post._id);

    res.status(201).json(post); // Send back the created post

  } catch (error) {
    // CRITICAL: Log the detailed Mongoose error
    console.error('--- Blog Create Failed ---');
    console.error('Mongoose Error:', error); // Log the full error object
    res.status(400); // Mongoose validation errors are typically 400 Bad Request
    // Send back a more specific error message
    throw new Error(`Failed to create blog post: ${error.message}`);
  }
});

/**
 * @desc    Get all blog posts (can add pagination later)
 * @route   GET /api/blog
 * @access  Public (or Private if needed for admin only initially)
 */
export const getBlogPosts = asyncHandler(async (req, res) => {
  console.log('--- Fetching All Blog Posts ---'); // DEBUG LOG
  try {
      const posts = await Blog.find({}).sort({ createdAt: -1 }); // Sort by newest first
      console.log(`Found ${posts.length} posts.`); // DEBUG LOG
      res.json(posts);
  } catch(error) {
      console.error("Error fetching blog posts:", error);
      res.status(500);
      throw new Error('Server error fetching blog posts.');
  }
});

/**
 * @desc    Get single blog post by slug
 * @route   GET /api/blog/:slug
 * @access  Public
 */
export const getBlogPostBySlug = asyncHandler(async (req, res) => {
    console.log(`--- Fetching Blog Post by Slug: ${req.params.slug} ---`); // DEBUG LOG
    try {
        const post = await Blog.findOne({ slug: req.params.slug });
        if (post) {
            console.log('Post found:', post.title); // DEBUG LOG
            res.json(post);
        } else {
            console.log('Post not found.'); // DEBUG LOG
            res.status(404);
            throw new Error('Blog post not found');
        }
    } catch(error) {
        console.error("Error fetching single post:", error);
        res.status(500);
        throw new Error('Server error fetching post.');
    }
});


/**
 * @desc    Update a blog post
 * @route   PUT /api/blog/:slug
 * @access  Private (Admin only)
 */
export const updateBlogPost = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { title, category, excerpt, markdownContent, slug: newSlug } = req.body;
    
    console.log(`--- Attempting to Update Blog Post: ${slug} ---`); // DEBUG LOG
    console.log('Update Data:', req.body); // DEBUG LOG

    const post = await Blog.findOne({ slug });

    if (!post) {
        res.status(404);
        throw new Error('Blog post not found');
    }

    // Check if slug is being changed and if the new slug already exists
    if (newSlug && newSlug !== slug) {
        const slugExists = await Blog.findOne({ slug: newSlug });
        if (slugExists) {
            res.status(400);
            throw new Error(`Cannot change slug to '${newSlug}', it already exists.`);
        }
        post.slug = newSlug;
    }

    post.title = title || post.title;
    post.category = category || post.category;
    post.excerpt = excerpt || post.excerpt;
    post.markdownContent = markdownContent || post.markdownContent;

    try {
        const updatedPost = await post.save();
        console.log('Blog post updated successfully.'); // DEBUG LOG
        res.json(updatedPost);
    } catch (error) {
        console.error('--- Blog Update Failed ---');
        console.error('Mongoose Error:', error); // Log the full error object
        res.status(400);
        throw new Error(`Failed to update blog post: ${error.message}`);
    }
});

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/blog/:slug
 * @access  Private (Admin only)
 */
export const deleteBlogPost = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    console.log(`--- Attempting to Delete Blog Post: ${slug} ---`); // DEBUG LOG

    const post = await Blog.findOne({ slug });

    if (post) {
        await Blog.deleteOne({ slug });
        console.log('Blog post deleted successfully.'); // DEBUG LOG
        res.json({ message: 'Blog post removed' });
    } else {
        console.log('Blog post not found for deletion.'); // DEBUG LOG
        res.status(404);
        throw new Error('Blog post not found');
    }
});