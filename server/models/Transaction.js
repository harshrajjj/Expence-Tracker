const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    default: 'Other',
    enum: [
      'Housing', 'Transportation', 'Food', 'Utilities', 'Insurance',
      'Healthcare', 'Savings', 'Personal', 'Entertainment', 'Education',
      'Clothing', 'Gifts', 'Income', 'Other'
    ]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true }, // Include virtuals when document is converted to JSON
  toObject: { virtuals: true } // Include virtuals when document is converted to object
});

// Add a virtual property 'id' that maps to '_id'
transactionSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
