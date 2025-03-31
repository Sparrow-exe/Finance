const User = require('../models/User');
const createError = require('http-errors');

const getUserField = async (userId, path) => {
  const user = await User.findById(userId).select(path);
  if (!user) throw createError(404, 'User not found');
  return path.includes('.') ? path.split('.').reduce((obj, key) => obj[key], user) : user[path];
};

const updateUserField = async (userId, path, value) => {
  const update = { $set: { [path]: value } };
  const user = await User.findByIdAndUpdate(userId, update, { new: true });
  if (!user) throw createError(404, 'User not found');
  return path.includes('.') ? path.split('.').reduce((obj, key) => obj[key], user) : user[path];
};

const resetUserField = async (userId, path, defaultValue = []) => {
  return await updateUserField(userId, path, defaultValue);
};

module.exports = {
  getUserField,
  updateUserField,
  resetUserField,
};
