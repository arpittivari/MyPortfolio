// server/models/contactMessage.model.js

import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    // Basic email format validation
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxLength: [1000, 'Message cannot exceed 1000 characters'],
  },
  read: { // Optional: Track if you've read the message
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

export default mongoose.model('ContactMessage', contactMessageSchema);