const mongoose = require('mongoose');

const savingsSchema = new mongoose.Schema({
  savingsName: { type: String, required: true },
  currentBalance: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  monthlyContribution: { type: Number, required: true },
  goalAmount: { type: Number },
  goalDate: { type: Date },
  type: { type: String, default: "" }, // e.g., emergency, retirement
  // New: compoundPeriod field for interest compounding frequency.
  compoundPeriod: { 
    type: String, 
    enum: ["monthly", "quarterly", "annually"], 
    default: "annually" 
  },
  date: { type: Date, default: Date.now },
  dateUpdated: { type: Date }
});

module.exports = mongoose.model('Savings', savingsSchema);
