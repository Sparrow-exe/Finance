// backend/middleware/validators.js
const { body, validationResult } = require('express-validator');

// User Registration Validation
const validateRegister = [
  body('email')
    .isEmail().withMessage('Email must be valid')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter')
    .matches(/\d/).withMessage('Password must contain a number')
    .matches(/[^a-zA-Z0-9]/).withMessage('Password must contain a symbol'),
  handleValidation,
];

// User Login Validation
const validateLogin = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

// Common handler to send back errors
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extracted = errors.array().map(err => ({ field: err.param, msg: err.msg }));
    return res.status(400).json({ errors: extracted });
  }
  next();
}

module.exports = { validateRegister, validateLogin };
