const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light',
    },
    currency: {
      type: String,
      default: 'USD',
    },
    notificationsEnabled: {
      type: Boolean,
      default: true,
    },
    emailNotifications: {
      type: Boolean,
      default: true,
    },
    monthlyBudgetReminder: {
      type: Boolean,
      default: true,
    },
    savingsGoalReminder: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: 'en',
    },
    paymentMethods: [
      {
        id: String,
        type: String, // credit_card, debit_card, bank_account, etc.
        name: String,
        lastDigits: String,
        isDefault: Boolean,
      },
    ],
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

module.exports = mongoose.model('Settings', settingsSchema);
