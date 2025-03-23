const express = require('express');
const router = express.Router();
const savingsController = require('../controllers/savingsController');

// Create new savings entry
router.post('/', savingsController.addSavings);
// Get all savings entries
router.get('/', savingsController.getSavings);
// Update a specific savings entry
router.put('/:id', savingsController.updateSavings);
// Delete a specific savings entry
router.delete('/:id', savingsController.deleteSavings);

module.exports = router;
