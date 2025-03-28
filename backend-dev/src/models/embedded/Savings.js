// models/embedded/Savings.js
const { Schema } = require('mongoose');
const commonFields = require('./commonFields');

module.exports = new Schema({
  name: String,
  category: String,
  type: String,
  apr: Number,
  amount: Number,
  baseMonthlyContrib: Number,
  additionalMonthlyContrib: Number,
  savingsGoal: Number,
  goalDate: Date,
  goalType: String,
  isAutoContributing: { type: Boolean, default: false },
  ...commonFields
});
