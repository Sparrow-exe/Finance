const Income = require('../models/Income');

const createIncome = async (incomeData) => {
  const income = new Income(incomeData);
  return await income.save();
};

const getAllIncome = async () => {
  return await Income.find();
};

const updateIncome = async (id, updateData) => {
  // Automatically update the dateUpdated field
  updateData.dateUpdated = new Date();
  return await Income.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteIncome = async (id) => {
  return await Income.findByIdAndDelete(id);
};

module.exports = {
  createIncome,
  getAllIncome,
  updateIncome,
  deleteIncome,
};
