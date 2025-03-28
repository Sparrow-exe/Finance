// controllers/user/savingsController.js
const User = require('../../models/User');

exports.getSavings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('finances.savings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.finances.savings);
  } catch (err) {
    console.error('Get savings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSavings = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'finances.savings': req.body } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.finances.savings);
  } catch (err) {
    console.error('Update savings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetSavings = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'finances.savings': [] } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.finances.savings);
  } catch (err) {
    console.error('Reset savings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};