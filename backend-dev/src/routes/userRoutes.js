const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const user = require('../controllers/user'); // centralized controller

// ⚙️ Settings
router.get('/settings', auth, user.getSettings);
router.put('/settings', auth, user.updateSettings);
router.delete('/settings', auth, user.resetSettings);

// 💸 Expenses
router.get('/expenses', auth, user.getExpenses);
router.post('/expenses', auth, user.updateExpenses);
router.delete('/expenses', auth, user.resetExpenses);

// 💳 Debt
router.get('/debt', auth, user.getDebt);
router.post('/debt', auth, user.updateDebt);
router.delete('/debt', auth, user.resetDebt);

// 💰 Income
router.get('/income', auth, user.getIncome);
router.post('/income', auth, user.updateIncome);
router.delete('/income', auth, user.resetIncome);

// 💾 Savings
router.get('/savings', auth, user.getSavings);
router.post('/savings', auth, user.updateSavings);
router.delete('/savings', auth, user.resetSavings);

// 🧩 Widgets
router.get('/widgets', auth, user.getWidgets);
router.post('/widgets', auth, user.updateWidgets);
router.delete('/widgets', auth, user.resetWidgets);

module.exports = router;
