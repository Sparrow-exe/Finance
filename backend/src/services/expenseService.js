const Expense = require('../models/Expense');

const createExpense = async (expenseData) => {
  const expense = new Expense(expenseData);
  return await expense.save();
};

const getAllExpenses = async () => {
  return await Expense.find();
};

const updateExpense = async (id, updateData) => {
  return await Expense.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteExpense = async (id) => {
  return await Expense.findByIdAndDelete(id);
};

module.exports = { createExpense, getAllExpenses, updateExpense, deleteExpense };
