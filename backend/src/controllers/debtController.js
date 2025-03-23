const debtService = require('../services/debtService');

const addDebt = async (req, res) => {
  try {
    const newDebt = await debtService.createDebt(req.body);
    res.status(201).json(newDebt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDebts = async (req, res) => {
  try {
    const debts = await debtService.getAllDebts();
    res.status(200).json(debts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateDebt = async (req, res) => {
  try {
    const updatedDebt = await debtService.updateDebt(req.params.id, req.body);
    res.status(200).json(updatedDebt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDebt = async (req, res) => {
  try {
    const deletedDebt = await debtService.deleteDebt(req.params.id);
    res.status(200).json(deletedDebt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addDebt, getDebts, updateDebt, deleteDebt };
