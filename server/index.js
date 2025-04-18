if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require('express');
const cors = require('cors');
// UUID is not needed with MongoDB as it generates its own IDs
const connectDB = require('./db');
const Transaction = require('./models/Transaction');
const Budget = require('./models/Budget');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Get all categories
app.get('/api/categories', (req, res) => {
  const categories = [
    'Housing', 'Transportation', 'Food', 'Utilities', 'Insurance',
    'Healthcare', 'Savings', 'Personal', 'Entertainment', 'Education',
    'Clothing', 'Gifts', 'Income', 'Other'
  ];
  res.json(categories);
});

// Budget endpoints
// Get all budgets
app.get('/api/budgets', async (req, res) => {
  try {
    const { month, year } = req.query;

    let query = {};
    if (month && year) {
      query = { month: parseInt(month), year: parseInt(year) };
    }

    const budgets = await Budget.find(query).sort({ category: 1 });
    res.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Add or update a budget
app.post('/api/budgets', async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;

    if (!category || amount === undefined || !month || !year) {
      return res.status(400).json({ error: 'Please provide category, amount, month, and year' });
    }

    // Try to find an existing budget for this category, month, and year
    let budget = await Budget.findOne({ category, month, year });

    if (budget) {
      // Update existing budget
      budget.amount = parseFloat(amount);
      await budget.save();
    } else {
      // Create new budget
      budget = new Budget({
        category,
        amount: parseFloat(amount),
        month: parseInt(month),
        year: parseInt(year)
      });
      await budget.save();
    }

    res.status(201).json(budget);
  } catch (error) {
    console.error('Error saving budget:', error);
    res.status(400).json({ error: 'Failed to save budget' });
  }
});

// Delete a budget
app.delete('/api/budgets/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const budget = await Budget.findById(id);

    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    await Budget.findByIdAndDelete(id);
    res.json(budget);
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(400).json({ error: 'Failed to delete budget' });
  }
});

// Get budget vs actual spending
app.get('/api/budget-vs-actual', async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: 'Please provide month and year' });
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

    res.json(result);
  } catch (error) {
    console.error('Error fetching budget vs actual:', error);
    res.status(500).json({ error: 'Failed to fetch budget vs actual data' });
  }
});

// Get all transactions
app.get('/api/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add a new transaction
app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, description, date, category } = req.body;

    if (!amount || !description || !date) {
      return res.status(400).json({ error: 'Please provide amount, description, and date' });
    }

    const newTransaction = new Transaction({
      amount: parseFloat(amount),
      description,
      date: new Date(date),
      category: category || (parseFloat(amount) > 0 ? 'Income' : 'Other')
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(400).json({ error: 'Failed to add transaction' });
  }
});

// Update a transaction
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description, date } = req.body;

    console.log('Updating transaction with ID:', id);

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      console.log('Transaction not found with ID:', id);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    transaction.amount = amount !== undefined ? parseFloat(amount) : transaction.amount;
    transaction.description = description || transaction.description;
    transaction.date = date ? new Date(date) : transaction.date;
    transaction.category = category || transaction.category;

    const updatedTransaction = await transaction.save();
    console.log('Transaction updated successfully:', updatedTransaction.id);
    res.json(updatedTransaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(400).json({ error: 'Failed to update transaction' });
  }
});

// Delete a transaction
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting transaction with ID:', id);

    const transaction = await Transaction.findById(id);

    if (!transaction) {
      console.log('Transaction not found with ID:', id);
      return res.status(404).json({ error: 'Transaction not found' });
    }

    await Transaction.findByIdAndDelete(id);
    console.log('Transaction deleted successfully:', id);
    res.json(transaction);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(400).json({ error: 'Failed to delete transaction' });
  }
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log('Connected to MongoDB');
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB. Server will not start:', err);
  process.exit(1);
});
