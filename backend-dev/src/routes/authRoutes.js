const express = require('express');
const router = express.Router();
const { registerValidator, loginValidator } = require('../middleware/validators');
const { register, login, logout } = require('../controllers/authController');
const { loginLimiter, registerLimiter, loginSlowDown } = require('../middleware/rateLimiter');

router.post('/register', registerLimiter, registerValidator, register);
router.post(
  '/login',
  loginLimiter,
  loginSlowDown,
  loginValidator,
  login
);

router.post('/logout', logout);

module.exports = router;
