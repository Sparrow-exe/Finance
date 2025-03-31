const User = require('../models/User');
const BlacklistedToken = require('../models/embedded/BlacklistedToken');
const { generateAccessToken, generateRefreshToken, verifyAccessToken } = require('../utils/tokenUtils');
const { hashPassword, comparePassword } = require('../utils/authUtils');
const { archiveRefreshToken } = require('../utils/tokenRotation');
const createError = require('http-errors');

exports.registerUser = async (email, password) => {
  const exists = await User.findOne({ email });
  if (exists) throw createError(400, 'Email already in use');

  const hashed = await hashPassword(password);
  const newUser = new User({ email, password: hashed });
  await newUser.save();
  return { message: 'User registered' };
};

exports.loginUser = async (email, password, req) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(400, 'Invalid credentials');

  if (user.lockout?.lockUntil && user.lockout.lockUntil > Date.now()) {
    throw createError(403, 'Account temporarily locked. Try again later.');
  }

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    user.lockout.failedAttempts = (user.lockout.failedAttempts || 0) + 1;
    if (user.lockout.failedAttempts >= 5) {
      user.lockout.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await user.save();
    throw createError(400, 'Invalid credentials');
  }

  user.lockout.failedAttempts = 0;
  user.lockout.lockUntil = null;

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  if (user.currentRefreshToken) {
    archiveRefreshToken(user, user.currentRefreshToken, req);
  }
  user.currentRefreshToken = refreshToken;
  await user.save();

  return {
    accessToken,
    user: { id: user._id, email: user.email },
    refreshToken,
  };
};

exports.logoutUser = async (accessToken, refreshToken, req) => {
  if (refreshToken) {
    const user = await User.findOne({ currentRefreshToken: refreshToken });
    if (user) {
      archiveRefreshToken(user, user.currentRefreshToken, req);
      user.currentRefreshToken = null;
      await user.save();
    }
  }

  if (accessToken) {
    const decoded = verifyAccessToken(accessToken);
    const expiresAt = new Date(decoded.exp * 1000);
    await BlacklistedToken.create({
      token: accessToken,
      userId: decoded.id,
      expiresAt,
    });
  }

  return { message: 'Logged out successfully' };
};
