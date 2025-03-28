// controllers/user/settingsController.js
const User = require('../../models/User');

exports.getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user.settings);
  } catch (err) {
    console.error('Get settings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { settings: { ...req.body, dateUpdated: new Date() } } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.settings);
  } catch (err) {
    console.error('Update settings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetSettings = async (req, res) => {
  try {
    const defaultSettings = {}; // optionally preload defaults here
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { settings: defaultSettings } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.settings);
  } catch (err) {
    console.error('Reset settings error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};