const express = require('express');
const router = express.Router();
const { registerValidator, loginValidator } = require('../middleware/validators');
const { register, login } = require('../controllers/authController');
const { registerLimiter, loginLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerLimiter, registerValidator, register);
router.post('/login', loginLimiter, loginValidator, login);

module.exports = router;
