const incomeService = require('../services/incomeService');

const addIncome = async (req, res) => {
  try {
    const newIncome = await incomeService.createIncome(req.body);
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getIncome = async (req, res) => {
  try {
    const incomes = await incomeService.getAllIncome();
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateIncome = async (req, res) => {
  try {
    const updatedIncome = await incomeService.updateIncome(req.params.id, req.body);
    res.status(200).json(updatedIncome);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteIncome = async (req, res) => {
  try {
    await incomeService.deleteIncome(req.params.id);
    res.status(200).json({ message: 'Income deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addIncome,
  getIncome,
  updateIncome,
  deleteIncome,
};
