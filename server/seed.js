if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const mongoose = require("mongoose");
const { sampleTransactions } = require("./data.js");
const Transaction = require("./models/Transaction.js");

const MONGO_URL = process.env.MONGO_URL;

async function seedDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB");
    
    // Clear existing data
    await Transaction.deleteMany({});
    console.log("Transactions collection cleared");
    
    // Insert sample data
    await Transaction.insertMany(sampleTransactions);
    console.log("Sample transactions inserted");
    
    // Disconnect
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  } catch (err) {
    console.log("Error in seeding database: ", err);
  }
}

seedDB();
