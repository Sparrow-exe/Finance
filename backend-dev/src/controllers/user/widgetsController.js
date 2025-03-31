const finance = require('../../services/userFinanceService');

exports.getWidgets = async (req, res, next) => {
  try {
    const widgets = await finance.getUserField(req.user.id, 'widgets');
    res.json(widgets);
  } catch (err) {
    next(err);
  }
};

exports.updateWidgets = async (req, res, next) => {
  try {
    const widgets = await finance.updateUserField(req.user.id, 'widgets', req.body);
    res.json(widgets);
  } catch (err) {
    next(err);
  }
};

exports.resetWidgets = async (req, res, next) => {
  try {
    const widgets = await finance.resetUserField(req.user.id, 'widgets', []);
    res.json(widgets);
  } catch (err) {
    next(err);
  }
};
