if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const mongoose = require("mongoose");

const MONGO_URL = process.env.MONGO_URL;

async function connectDB(){
  console.log("Attempting to connect to MongoDB...");

  // Connect to MongoDB - will throw an error if connection fails
  const conn = await mongoose.connect(MONGO_URL, {
    serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
  return conn;
}

module.exports = connectDB;
