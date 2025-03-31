const finance = require('../../services/userFinanceService');

exports.getDebt = async (req, res, next) => {
  try {
    const debt = await finance.getUserField(req.user.id, 'finances.debt');
    res.json(debt);
  } catch (err) {
    next(err);
  }
};

exports.updateDebt = async (req, res, next) => {
  try {
    const debt = await finance.updateUserField(req.user.id, 'finances.debt', req.body);
    res.json(debt);
  } catch (err) {
    next(err);
  }
};

exports.resetDebt = async (req, res, next) => {
  try {
    const debt = await finance.resetUserField(req.user.id, 'finances.debt');
    res.json(debt);
  } catch (err) {
    next(err);
  }
};
