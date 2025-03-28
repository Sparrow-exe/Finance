// controllers/user/widgetsController.js
const User = require('../../models/User');

exports.getWidgets = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('widgets');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.widgets);
  } catch (err) {
    console.error('Get widgets error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateWidgets = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { widgets: req.body } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.widgets);
  } catch (err) {
    console.error('Update widgets error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetWidgets = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { widgets: [] } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.widgets);
  } catch (err) {
    console.error('Reset widgets error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};