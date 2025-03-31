const finance = require('../../services/userFinanceService');

exports.getSavings = async (req, res, next) => {
  try {
    const savings = await finance.getUserField(req.user.id, 'finances.savings');
    res.json(savings);
  } catch (err) {
    next(err);
  }
};

exports.updateSavings = async (req, res, next) => {
  try {
    const savings = await finance.updateUserField(req.user.id, 'finances.savings', req.body);
    res.json(savings);
  } catch (err) {
    next(err);
  }
};

exports.resetSavings = async (req, res, next) => {
  try {
    const savings = await finance.resetUserField(req.user.id, 'finances.savings');
    res.json(savings);
  } catch (err) {
    next(err);
  }
};
