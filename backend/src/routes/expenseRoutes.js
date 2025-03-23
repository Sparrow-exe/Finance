const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

// Create new expense entry
router.post('/', expenseController.addExpense);
// Get all expense entries
router.get('/', expenseController.getExpenses);
// Update a specific expense entry
router.put('/:id', expenseController.updateExpense);
// Delete a specific expense entry
router.delete('/:id', expenseController.deleteExpense);

module.exports = router;
