const User = require('../models/User');

// ✅ GET /api/user/me
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { password, ...userData } = user;
    res.json(userData);
  } catch (err) {
    console.error('Get user data error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ PUT /api/user/settings
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

// ✅ POST /api/user/widgets
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

// ✅ POST /api/user/income
exports.updateIncome = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'finances.income': req.body } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.finances.income);
  } catch (err) {
    console.error('Update income error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ POST /api/user/savings
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

// ✅ POST /api/user/debt
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

// ✅ POST /api/user/expenses
exports.updateExpenses = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { $set: { 'finances.expenses': req.body } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated.finances.expenses);
  } catch (err) {
    console.error('Update expenses error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
