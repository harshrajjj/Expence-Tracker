// Load environment variables
require("dotenv").config();

const mongoose = require("mongoose");

// Use MONGODB_URI for Vercel deployment, fall back to MONGO_URL for local development
const MONGO_URL = process.env.MONGODB_URI || process.env.MONGO_URL;

if (!MONGO_URL) {
  console.error('❌ MongoDB connection string not found in environment variables');
  // Don't throw an error here, as it would crash the app
  // Instead, let the connection attempt fail and handle the error
}

async function connectDB(){
  console.log("Attempting to connect to MongoDB...");

  try {
    // Connect to MongoDB - will throw an error if connection fails
    const conn = await mongoose.connect(MONGO_URL, {
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    // In production, we don't want to crash the app
    if (process.env.NODE_ENV !== 'production') {
      throw error; // Re-throw in development for better debugging
    }
    // In production, return a dummy connection object
    return { connection: { host: 'none' } };
  }
}

module.exports = connectDB;
