const finance = require('../../services/userFinanceService');

exports.getExpenses = async (req, res, next) => {
  try {
    const expenses = await finance.getUserField(req.user.id, 'finances.expenses');
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

exports.updateExpenses = async (req, res, next) => {
  try {
    const expenses = await finance.updateUserField(req.user.id, 'finances.expenses', req.body);
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};

exports.resetExpenses = async (req, res, next) => {
  try {
    const expenses = await finance.resetUserField(req.user.id, 'finances.expenses');
    res.json(expenses);
  } catch (err) {
    next(err);
  }
};
