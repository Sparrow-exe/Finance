// backend/seed/seedUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function seedUser() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const hashedPassword = await bcrypt.hash('Test@1234', 12);

    const newUser = new User({
      email: 'testuser@example.com',
      password: hashedPassword,

      finances: {
        income: [{
          name: 'Full-Time Job',
          category: 'Primary',
          type: 'salary',
          salaryPay: 65000,
          hoursPerWeek: 40,
          payFrequency: 'monthly',
          tags: ['career', 'main']
        }],

        savings: [{
          name: 'Emergency Fund',
          category: 'Safety',
          type: 'High Yield Savings',
          apr: 3.5,
          amount: 4000,
          baseMonthlyContrib: 200,
          additionalMonthlyContrib: 50,
          savingsGoal: 10000,
          goalDate: new Date('2025-12-31'),
          goalType: 'emergency',
          isAutoContributing: true,
          tags: ['safety']
        }],

        debt: [{
          name: 'Student Loan',
          category: 'Education',
          type: 'Federal',
          apr: 4.2,
          initialBalance: 30000,
          currentBalance: 21000,
          minimumPayment: 300,
          additionalPayment: 50,
          lenderName: 'FedLoan',
          accountNumber: '1234-5678',
          tags: ['student']
        }],

        expenses: [{
          name: 'Essentials',
          tags: ['monthly'],
          expenses: [{
            name: 'Rent',
            estimatedAmount: 1200,
            budgetedAmount: 1200,
            actualAmount: 1200,
            recurring: true,
            frequency: 'monthly',
            daysEachMonth: [1],
            paymentMethod: 'bank',
            tags: ['fixed']
          }]
        }]
      },

      widgets: [{
        name: 'Net Worth Overview',
        type: 'netWorthSummary',
        positionOptions: [{ x: 0, y: 0, width: 6, height: 3 }],
        tags: ['dashboard']
      }],

      settings: {
        email: 'testuser@example.com',
        theme: 'dark',
        defaultDashboard: 'overview',
        showWelcomeTips: true,
        compactMode: false,
        currency: 'USD',
        defaultPayFrequency: 'monthly',
        defaultStartOfMonth: 1,
        roundingPreference: 'exact',
        showNetWorthOnHome: true,
        emailNotifications: true,
        monthlySummaryEmails: true,
        uiHintsEnabled: true
      }
    });

    await newUser.save();
    console.log('✅ Test user seeded successfully!');
    mongoose.connection.close();
  } catch (err) {
    console.error('❌ Seed failed:', err);
    mongoose.connection.close();
  }
}

seedUser();
