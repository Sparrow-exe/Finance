const express = require('express');
const { refreshAccessToken } = require('./controllers/refreshController');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const verifyToken = require('./middleware/auth');
const globalMiddleware = require('./middleware');
require('./utils/securityAlertHandler');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Core Middleware
app.use(globalMiddleware);
app.set("trust proxy", 1)

// Routes
app.use('/api/auth', authRoutes);
app.post('/api/refresh', refreshAccessToken);
app.use('/api/user', userRoutes);

// Test Protected Route
app.get('/api/auth/protected', verifyToken, (req, res) => {
  res.json({ message: 'You are authorized!', user: req.user });
});

app.get('/', (req, res) => {
  res.send('OK');
});

app.use(errorHandler);


module.exports = app;
