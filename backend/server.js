// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const verifyToken = require('./middleware/auth');
const { refreshAccessToken } = require('./controllers/refreshController');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const userRoutes = require('./routes/user');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());

app.use('/api/auth', authRoutes);
app.post('/refresh', refreshAccessToken); // <- new
app.use('/api/user', userRoutes);


app.get('/api/auth/protected', verifyToken, (req, res) => {
  res.json({ message: 'You are authorized!', user: req.user });
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  app.listen(3000, () => console.log('Server running on port 3000'));
}).catch((err) => {
  console.error('MongoDB connection error:', err.message);
});
