import mongoose from 'mongoose';
import 'colors';

// This is your cleaner connectDB function
const connectDB = async () => {
  try {
    // It's a good practice to check if the URI exists first
    if (!process.env.MONGO_URI) {
      console.error('MONGO_URI is not defined in .env file'.red.underline.bold);
      process.exit(1);
    }
    
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`.red.underline.bold);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;

