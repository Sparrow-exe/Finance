// models/embedded/Expenses.js
const { Schema } = require('mongoose');
const commonFields = require('./commonFields');
const ExpenseEntrySchema = require('./ExpenseEntry');

module.exports = new Schema({
  name: String,
  ...commonFields,
  expenses: [ExpenseEntrySchema]
});