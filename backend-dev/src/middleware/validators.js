// backend/middleware/validators.js
const { body, validationResult } = require('express-validator');

// 📌 Shared error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formatted = errors.array().map(({ param, msg }) => ({
      field: param,
      msg,
    }));
    return res.status(400).json({ errors: formatted });
  }
  next();
};

// ✅ Validation: User Registration
const registerValidator = [
  body('email')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Must contain a lowercase letter')
    .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
    .matches(/\d/).withMessage('Must contain a number')
    .matches(/[^a-zA-Z0-9]/).withMessage('Must contain a symbol'),

  handleValidationErrors
];

// ✅ Validation: User Login
const loginValidator = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

module.exports = {
  registerValidator,
  loginValidator,
  handleValidationErrors
};
