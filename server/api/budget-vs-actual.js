// Load environment variables
require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../db");
const Transaction = require("../models/Transaction");
const Budget = require("../models/Budget");

// Connect to MongoDB
connectDB().catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(200).json([]);
    }

    // Get all budgets for the specified month and year
    const budgets = await Budget.find({
      month: parseInt(month),
      year: parseInt(year)
    });

    // Get all transactions for the specified month and year
    const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    const endDate = new Date(parseInt(year), parseInt(month), 0);

    const transactions = await Transaction.find({
      date: { $gte: startDate, $lte: endDate },
      amount: { $lt: 0 } // Only include expenses
    });

    // Calculate actual spending by category
    const actualSpending = {};
    transactions.forEach(transaction => {
      const category = transaction.category || 'Other';
      if (!actualSpending[category]) {
        actualSpending[category] = 0;
      }
      actualSpending[category] += Math.abs(transaction.amount);
    });

    // Combine budget and actual data
    const result = budgets.map(budget => {
      const category = budget.category;
      const budgetAmount = budget.amount;
      const actualAmount = actualSpending[category] || 0;
      const difference = budgetAmount - actualAmount;
      const percentUsed = budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0;

      return {
        category,
        budgetAmount,
        actualAmount,
        difference,
        percentUsed
      };
    });

    // Add categories with spending but no budget
    Object.keys(actualSpending).forEach(category => {
      const exists = result.some(item => item.category === category);
      if (!exists && category !== 'Income') {
        result.push({
          category,
          budgetAmount: 0,
          actualAmount: actualSpending[category],
          difference: -actualSpending[category],
          percentUsed: 100
        });
      }
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching budget vs actual:', error);
    // Return empty array instead of error for better client handling
    res.status(200).json([]);
  }
};
