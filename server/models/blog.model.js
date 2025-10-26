// server/models/blog.model.js - FINAL VERSION

import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Blog post title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Blog post slug is required'],
      unique: true, // Ensure slugs are unique
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      // Optional: Add enum if you want to restrict categories
      // enum: ['Full Stack', 'Embedded C', 'IoT Networking', 'Edge AI', 'Machine Learning', 'Systems Architecture'],
    },
    excerpt: {
      type: String,
      required: [true, 'Excerpt (short summary) is required'],
      maxLength: [200, 'Excerpt cannot be more than 200 characters'],
    },
    markdownContent: {
      type: String,
      required: [true, 'Markdown content is required'],
    },
    // author: { // Optional: Link to the admin user
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   required: true,
    // },
  },
  { timestamps: true }
);

export default mongoose.model('Blog', blogSchema);