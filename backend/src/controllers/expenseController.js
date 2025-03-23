const expenseService = require('../services/expenseService');

const addExpense = async (req, res) => {
  try {
    const newExpense = await expenseService.createExpense(req.body);
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAllExpenses();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const updatedExpense = await expenseService.updateExpense(req.params.id, req.body);
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const deletedExpense = await expenseService.deleteExpense(req.params.id);
    res.status(200).json(deletedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addExpense, getExpenses, updateExpense, deleteExpense };
