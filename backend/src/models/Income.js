const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
  source: { type: String, required: true },
  notes: { type: String, default: "" },
  frequency: { type: String, default: "one-time" },
  category: { type: String, default: "" },
  // New fields for pay type:
  payType: { type: String, enum: ["hourly", "salary"], default: "salary" },
  hourlyRate: { type: Number, default: null },
  // New: Total hours per week (for hourly)
  hoursPerWeek: { type: Number, default: 40 },
  annualSalary: { type: Number, default: null },
  date: { type: Date, default: Date.now },
  dateUpdated: { type: Date }
});

module.exports = mongoose.model('Income', incomeSchema);
