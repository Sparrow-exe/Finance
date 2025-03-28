const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
} = require('../utils/tokenUtils');
const {
  hashPassword,
  comparePassword,
} = require('../utils/authUtils');
const { refreshCookieOptions } = require('../utils/cookieUtils');
const { archiveRefreshToken } = require('../utils/tokenRotation');

exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await hashPassword(password);
    const newUser = new User({ email, password: hashed });
    await newUser.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Rotate refresh token
    if (user.currentRefreshToken) {
      archiveRefreshToken(user, req);
    }
    user.currentRefreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, refreshCookieOptions);
    res.json({ accessToken, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
