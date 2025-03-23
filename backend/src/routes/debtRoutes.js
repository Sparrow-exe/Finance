const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debtController');

// Create new debt entry
router.post('/', debtController.addDebt);
// Get all debt entries
router.get('/', debtController.getDebts);
// Update a specific debt entry
router.put('/:id', debtController.updateDebt);
// Delete a specific debt entry
router.delete('/:id', debtController.deleteDebt);

module.exports = router;
