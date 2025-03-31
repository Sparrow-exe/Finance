const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} = require('../utils/tokenUtils');
const {
  handleTokenReuse,
  archiveRefreshToken
} = require('../utils/tokenRotation');
const createError = require('http-errors');

exports.refreshAccess = async (refreshToken, req) => {
  if (!refreshToken) throw createError(401, 'No refresh token');

  const decoded = verifyRefreshToken(refreshToken);
  const user = await User.findById(decoded.id);
  if (!user) throw createError(404, 'User not found');

  if (refreshToken !== user.currentRefreshToken) {
    const { isReused } = await handleTokenReuse(user, refreshToken);
    if (isReused) {
      throw createError(403, 'Refresh token reuse detected');
    }
    throw createError(403, 'Invalid refresh token');
  }

  const newRefreshToken = generateRefreshToken({ id: user._id, timestamp: user.timestamp });
  const newAccessToken = generateAccessToken(user._id);

  archiveRefreshToken(user, user.currentRefreshToken, req);
  user.currentRefreshToken = newRefreshToken;
  await user.save();

  return { newAccessToken, newRefreshToken };
};
