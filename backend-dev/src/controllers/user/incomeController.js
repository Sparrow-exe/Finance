// controllers/user/incomeController.js
const User = require('../../models/User');

exports.getIncome = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('finances.income');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.finances.income);
  } catch (err) {
    console.error('Get income error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'finances.income': req.body } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.finances.income);
  } catch (err) {
    console.error('Update income error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetIncome = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'finances.income': [] } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.finances.income);
  } catch (err) {
    console.error('Reset income error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
