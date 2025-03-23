const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  debtName: { type: String, required: true },
  balance: { type: Number, required: true },
  apr: { type: Number, required: true },
  monthlyPayment: { type: Number, required: true },
  // New fields:
  type: { type: String, default: "" }, // e.g., "credit card", "student loan"
  dueDate: { type: Number, min: 1, max: 31 }, // Due day each month
  minimumPayment: { type: Number },      // Minimum required payment amount
  status: { type: String, default: "active" }, // e.g., "active", "in arrears", "paid off"
  date: { type: Date, default: Date.now },
  dateUpdated: { type: Date }
});

module.exports = mongoose.model('Debt', debtSchema);
