const finance = require('../../services/userFinanceService');

exports.getIncome = async (req, res, next) => {
  try {
    const income = await finance.getUserField(req.user.id, 'finances.income');
    res.json(income);
  } catch (err) {
    next(err);
  }
};

exports.updateIncome = async (req, res, next) => {
  try {
    const income = await finance.updateUserField(req.user.id, 'finances.income', req.body);
    res.json(income);
  } catch (err) {
    next(err);
  }
};

exports.resetIncome = async (req, res, next) => {
  try {
    const income = await finance.resetUserField(req.user.id, 'finances.income');
    res.json(income);
  } catch (err) {
    next(err);
  }
};
