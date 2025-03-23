const savingsService = require('../services/savingsService');

const addSavings = async (req, res) => {
  try {
    const newSavings = await savingsService.createSavings(req.body);
    res.status(201).json(newSavings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSavings = async (req, res) => {
  try {
    const savings = await savingsService.getAllSavings();
    res.status(200).json(savings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSavings = async (req, res) => {
  try {
    const updatedSavings = await savingsService.updateSavings(req.params.id, req.body);
    res.status(200).json(updatedSavings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSavings = async (req, res) => {
  try {
    const deletedSavings = await savingsService.deleteSavings(req.params.id);
    res.status(200).json(deletedSavings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addSavings, getSavings, updateSavings, deleteSavings };
