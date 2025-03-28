const mongoose = require('mongoose');
const { Schema } = mongoose;

// 🔁 Shared Metadata Fields
const commonFields = {
  customId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  tags: [String],
  createdBy: String,
  updatedBy: String,
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
  notes: String
};

//
// 💰 INCOME
//
const IncomeSchema = new Schema({
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

//
// 💾 SAVINGS
//
const SavingsSchema = new Schema({
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

//
// 💳 DEBT
//
const DebtSchema = new Schema({
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

//
// 💸 EXPENSES
//
const ExpenseEntrySchema = new Schema({
  name: String,
  estimatedAmount: Number,
  budgetedAmount: Number,
  actualAmount: Number,
  recurring: Boolean,
  frequency: String, // e.g. 'monthly', 'weekly'
  daysEachMonth: [Number], // e.g. [1, 15]
  linkedAccount: String,
  paymentMethod: {
    type: String,
    enum: ['cash', 'debit', 'credit', 'bank', 'other'],
    default: 'other'
  },
  ...commonFields
});

const ExpenseCategorySchema = new Schema({
  name: String,
  ...commonFields,
  expenses: [ExpenseEntrySchema]
});

//
// 🧩 WIDGETS
//
const WidgetSchema = new Schema({
  name: String,
  type: String, // e.g., 'incomeChart', 'netWorthSummary'
  positionOptions: [{
    x: Number,
    y: Number,
    width: Number,
    height: Number
  }],
  ...commonFields
});

//
// ⚙️ SETTINGS
//
const SettingsSchema = new Schema({
  // Account & Security
  email: String,
  twoFactorEnabled: { type: Boolean, default: false },
  loginAlerts: { type: Boolean, default: true },
  lastLogin: Date,
  passwordUpdatedAt: Date,

  // Dashboard Preferences
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
  defaultDashboard: { type: String, default: 'overview' },
  showWelcomeTips: { type: Boolean, default: true },
  compactMode: { type: Boolean, default: false },

  // Financial Preferences
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

  // Notifications
  emailNotifications: { type: Boolean, default: true },
  monthlySummaryEmails: { type: Boolean, default: true },
  uiHintsEnabled: { type: Boolean, default: true },

  ...commonFields
});

const RoleSchema = new Schema({
  role: { type: String, enum: ['user', 'admin', 'moderator'], required: true },
  assignedAt: { type: Date, default: Date.now },
  assignedBy: String,
});

const RefreshTokenSchema = new Schema({
  token: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  lastUsedAt: Date,
  ip: String,
  userAgent: String
});

//
// 👤 USER SCHEMA
//
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentRefreshToken: { type: String },
  previousRefreshTokens: [RefreshTokenSchema],

  // 🔑 Roles
  RBAC: [RoleSchema],

  finances: {
    income: [IncomeSchema],
    savings: [SavingsSchema],
    debt: [DebtSchema],
    expenses: [ExpenseCategorySchema]
  },

  widgets: [WidgetSchema],
  settings: SettingsSchema

}, { timestamps: true, });

module.exports = mongoose.model('User', UserSchema);
