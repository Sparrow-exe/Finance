const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter')
const { validateRegister, validateLogin } = require('../middleware/validators');

router.post('/register', registerLimiter, validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);

module.exports = router;
