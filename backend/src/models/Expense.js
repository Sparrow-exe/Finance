const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: { type: String, required: true },
  description: { type: String, default: "" },
  budgeted: { type: Number, required: true },
  actual: { type: Number, default: 0 },
  // New fields:
  recurring: { type: Boolean, default: false },
  paymentMethod: { type: String, default: "" },
  notes: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  dateUpdated: { type: Date }
});

module.exports = mongoose.model('Expense', expenseSchema);
