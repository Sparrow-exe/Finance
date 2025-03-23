const Debt = require('../models/Debt');

const createDebt = async (debtData) => {
  const debt = new Debt(debtData);
  return await debt.save();
};

const getAllDebts = async () => {
  return await Debt.find();
};

const updateDebt = async (id, updateData) => {
  return await Debt.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteDebt = async (id) => {
  return await Debt.findByIdAndDelete(id);
};

module.exports = { createDebt, getAllDebts, updateDebt, deleteDebt };
