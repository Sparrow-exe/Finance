// models/embedded/Debt.js
const { Schema } = require('mongoose');
const commonFields = require('./commonFields');

module.exports = new Schema({
  name: String,
  category: String,
  type: String,
  apr: Number,
  initialBalance: Number,
  currentBalance: Number,
  minimumPayment: Number,
  additionalPayment: Number,
  lenderName: String,
  accountNumber: String,
  ...commonFields
});