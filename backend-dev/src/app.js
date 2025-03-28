const express = require('express');
const { refreshAccessToken } = require('./controllers/refreshController');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const verifyToken = require('./middleware/auth');
const globalMiddleware = require('./middleware');

const app = express();

// Core Middleware
app.use(globalMiddleware);

// Routes
app.use('/api/auth', authRoutes);
app.post('/refresh', refreshAccessToken);
app.use('/api/user', userRoutes);

// Test Protected Route
app.get('/api/auth/protected', verifyToken, (req, res) => {
  res.json({ message: 'You are authorized!', user: req.user });
});

module.exports = app;
