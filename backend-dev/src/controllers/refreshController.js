const { refreshAccess } = require('../services/tokenService');

exports.refreshAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const { newAccessToken, newRefreshToken } = await refreshAccess(token, req);

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err); // handled by centralized error handler
  }
};
