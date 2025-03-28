const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/tokenUtils');
const {
  handleTokenReuse,
  archiveRefreshToken,
} = require('../utils/tokenRotation');

exports.refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (token !== user.currentRefreshToken) {
      const { isReused } = await handleTokenReuse(user, token);
      if (isReused) {
        return res.status(403).json({ message: 'Refresh token reuse detected' });
      }
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const newRefreshToken = generateRefreshToken(user._id);
    const newAccessToken = generateAccessToken(user._id);

    archiveRefreshToken(user, user.currentRefreshToken, req);
    user.currentRefreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
