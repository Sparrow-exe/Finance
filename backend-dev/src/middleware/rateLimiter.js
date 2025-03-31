// backend/middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down'); // Optional: gradually slow brute force

// Middleware: limit login attempts per IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    message: 'Too many login attempts from this IP. Try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware: slow brute force by delaying responses
const loginSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 3,
  delayMs: () => 500, // Add 500ms delay per request after 3 attempts
});

// 2. Limit for registration (less strict)
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 registration attempts per hour
  message: {
    message: 'Too many registration attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { loginLimiter, registerLimiter, loginSlowDown };
