// controllers/user/expensesController.js
const User = require('../../models/User');

exports.getExpenses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('finances.expenses');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.finances.expenses);
  } catch (err) {
    console.error('Get expenses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateExpenses = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'finances.expenses': req.body } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.finances.expenses);
  } catch (err) {
    console.error('Update expenses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetExpenses = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'finances.expenses': [] } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.finances.expenses);
  } catch (err) {
    console.error('Reset expenses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
