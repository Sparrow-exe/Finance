// backend/routes/user.js
const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const {
  getUserData,
  updateSettings,
  updateWidgets,
  updateIncome,
  updateSavings,
  updateDebt,
  updateExpenses
} = require('../controllers/userController');

router.get('/me', verifyToken, getUserData);
router.put('/settings', verifyToken, updateSettings);
router.post('/widgets', verifyToken, updateWidgets);
router.post('/income', verifyToken, updateIncome);
router.post('/savings', verifyToken, updateSavings);
router.post('/debt', verifyToken, updateDebt);
router.post('/expenses', verifyToken, updateExpenses);

module.exports = router;
