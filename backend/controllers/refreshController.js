const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.refreshAccessToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Reuse detection
    if (token !== user.currentRefreshToken) {
      const reused = user.previousRefreshTokens.find(t => t.token === token);
      if (reused) {
        // Token reuse detected
        user.currentRefreshToken = null;
        await user.save();
        return res.status(403).json({ message: 'Refresh token reuse detected' });
      } else {
        return res.status(403).json({ message: 'Invalid refresh token' });
      }
    }

    // Rotate token
    const newRefreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Archive old token
    user.previousRefreshTokens.push({
      token: user.currentRefreshToken,
      lastUsedAt: new Date(),
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });
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
