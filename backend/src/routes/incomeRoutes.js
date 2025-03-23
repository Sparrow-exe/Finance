const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');

// Create new income entry
router.post('/', incomeController.addIncome);

// Get all income entries
router.get('/', incomeController.getIncome);

// Update a specific income entry
router.put('/:id', incomeController.updateIncome);

// Delete a specific income entry
router.delete('/:id', incomeController.deleteIncome);

module.exports = router;
