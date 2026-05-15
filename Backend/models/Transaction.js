const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Housing',
        'Food',
        'Transportation',
        'Entertainment',
        'Healthcare',
        'Utilities',
        'Shopping',
        'Income',
        'Other',
      ],
    },
    type: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    budget: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Budget',
      default: null,
    },
    notes: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', transactionSchema);
