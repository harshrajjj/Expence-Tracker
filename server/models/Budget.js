const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetSchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'Housing', 'Transportation', 'Food', 'Utilities', 'Insurance',
      'Healthcare', 'Savings', 'Personal', 'Entertainment', 'Education',
      'Clothing', 'Gifts', 'Other'
    ]
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true,
    min: 2000
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add a virtual property 'id' that maps to '_id'
budgetSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Create a compound index to ensure uniqueness of category, month, and year
budgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;
