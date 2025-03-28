exports.logout = async (req, res) => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return res.clearCookie('refreshToken').status(204).send();
  
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);
      if (user) {
        user.currentRefreshToken = null;
        user.previousRefreshTokens = [];
        await user.save();
      }
  
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      });
  
      res.status(204).send();
    } catch (err) {
      res.clearCookie('refreshToken').status(204).send();
    }
  };
  