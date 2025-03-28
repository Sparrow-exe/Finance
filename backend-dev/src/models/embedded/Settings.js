// models/embedded/Settings.js
const { Schema } = require('mongoose');
const commonFields = require('./commonFields');

module.exports = new Schema({
  email: String,
  twoFactorEnabled: { type: Boolean, default: false },
  loginAlerts: { type: Boolean, default: true },
  lastLogin: Date,
  passwordUpdatedAt: Date,

  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  defaultDashboard: { type: String, default: 'overview' },
  showWelcomeTips: { type: Boolean, default: true },
  compactMode: { type: Boolean, default: false },

  currency: { type: String, default: 'USD' },
  defaultPayFrequency: {
    type: String,
    enum: ['weekly', 'biweekly', 'monthly', 'annual'],
    default: 'monthly'
  },
  defaultStartOfMonth: { type: Number, default: 1 },
  roundingPreference: {
    type: String,
    enum: ['exact', 'nearestDollar'],
    default: 'exact'
  },
  showNetWorthOnHome: { type: Boolean, default: true },

  emailNotifications: { type: Boolean, default: true },
  monthlySummaryEmails: { type: Boolean, default: true },
  uiHintsEnabled: { type: Boolean, default: true },

  ...commonFields
});