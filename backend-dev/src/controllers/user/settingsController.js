const finance = require('../../services/userFinanceService');

exports.getSettings = async (req, res, next) => {
  try {
    const settings = await finance.getUserField(req.user.id, 'settings');
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const updated = await finance.updateUserField(req.user.id, 'settings', {
      ...req.body,
      dateUpdated: new Date()
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.resetSettings = async (req, res, next) => {
  try {
    const defaultSettings = {}; // or populate with actual defaults
    const reset = await finance.resetUserField(req.user.id, 'settings', defaultSettings);
    res.json(reset);
  } catch (err) {
    next(err);
  }
};
