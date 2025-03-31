const mongoose = require('mongoose');
const { Schema } = mongoose;

const IncomeSchema = require('./embedded/Income');
const SavingsSchema = require('./embedded/Savings');
const DebtSchema = require('./embedded/Debt');
const ExpenseCategorySchema = require('./embedded/Expenses');
const WidgetSchema = require('./embedded/Widgets');
const SettingsSchema = require('./embedded/Settings');
const RoleSchema = require('./embedded/Roles');
const RefreshTokenSchema = require('./embedded/RefreshToken');

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  lockout: {
    failedAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
  },


  currentRefreshToken: { type: String },
  previousRefreshTokens: [RefreshTokenSchema],
  RBAC: [RoleSchema],

  finances: {
    income: [IncomeSchema],
    savings: [SavingsSchema],
    debt: [DebtSchema],
    expenses: [ExpenseCategorySchema],
  },

  widgets: [WidgetSchema],
  settings: SettingsSchema,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
