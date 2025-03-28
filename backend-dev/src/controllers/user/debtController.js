// controllers/user/debtController.js
const User = require('../../models/User');

exports.getDebt = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('finances.debt');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.finances.debt);
  } catch (err) {
    console.error('Get debt error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateDebt = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'finances.debt': req.body } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.finances.debt);
  } catch (err) {
    console.error('Update debt error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetDebt = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'finances.debt': [] } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.finances.debt);
  } catch (err) {
    console.error('Reset debt error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};