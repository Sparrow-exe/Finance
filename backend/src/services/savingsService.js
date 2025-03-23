const Savings = require('../models/Savings');

const createSavings = async (savingsData) => {
  const savings = new Savings(savingsData);
  return await savings.save();
};

const getAllSavings = async () => {
  return await Savings.find();
};

const updateSavings = async (id, updateData) => {
  return await Savings.findByIdAndUpdate(id, updateData, { new: true });
};

const deleteSavings = async (id) => {
  return await Savings.findByIdAndDelete(id);
};

module.exports = { createSavings, getAllSavings, updateSavings, deleteSavings };
