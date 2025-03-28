const { Schema } = require('mongoose');
const commonFields = require('./commonFields');

module.exports = new Schema({
  name: String,
  category: String,
  type: { type: String, enum: ['hourly', 'salary'] },
  hourlyPay: Number,
  salaryPay: Number,
  hoursPerWeek: Number,
  payFrequency: { type: String, enum: ['weekly', 'biweekly', 'monthly', 'annual'] },
  startDate: Date,
  endDate: Date,
  ...commonFields
});
