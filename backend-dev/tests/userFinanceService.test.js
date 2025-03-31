// tests/userFinanceService.test.js
const mongoose = require('mongoose');
const User = require('../src/models/User');
const { getUserField, updateUserField, resetUserField } = require('../src/services/userFinanceService');

describe('User Finance Service', () => {
  let user;
  beforeAll(async () => {
    // Create a test user directly in the DB
    user = new User({
      email: 'finance@test.com',
      password: 'dummy', // password not important here
      finances: {
        income: [{ name: 'Job A', salaryPay: 50000 }],
        savings: [{ name: 'Savings A', amount: 1000 }],
        debt: [{ name: 'Credit Card', currentBalance: 2000 }],
        expenses: [{ name: 'Rent', estimatedAmount: 1000 }],
      },
      settings: { theme: 'light' },
      widgets: [{ name: 'netWorth', type: 'summary' }],
    });
    await user.save();
  });

  afterAll(async () => {
    await User.deleteMany({});
    // mongoose.connection.close() will be handled by setup.js
  });

  test('should get user income field', async () => {
    const income = await getUserField(user._id, 'finances.income');
    expect(Array.isArray(income)).toBe(true);
    expect(income[0].salaryPay).toBe(50000);
  });

  test('should update user savings field', async () => {
    const newSavings = [{ name: 'Emergency Fund', amount: 2000 }];
    const savings = await updateUserField(user._id, 'finances.savings', newSavings);
    expect(savings[0].name).toBe('Emergency Fund');
    expect(savings[0].amount).toBe(2000);
  });

  test('should reset user expenses field', async () => {
    const expenses = await resetUserField(user._id, 'finances.expenses');
    expect(expenses).toEqual([]);
  });
});
