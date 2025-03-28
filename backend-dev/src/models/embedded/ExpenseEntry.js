// models/embedded/ExpenseEntry.js
const { Schema } = require('mongoose');
const commonFields = require('./commonFields');

module.exports = new Schema({
  name: String,
  estimatedAmount: Number,
  budgetedAmount: Number,
  actualAmount: Number,
  recurring: Boolean,
  frequency: String,
  daysEachMonth: [Number],
  linkedAccount: String,
  paymentMethod: {
    type: String,
    enum: ['cash', 'debit', 'credit', 'bank', 'other'],
    default: 'other'
  },
  ...commonFields
});