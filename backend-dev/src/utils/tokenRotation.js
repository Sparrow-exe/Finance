const handleTokenReuse = async (user, token) => {
    const reused = user.previousRefreshTokens.find(t => t.token === token);
    if (reused) {
      user.currentRefreshToken = null;
      await user.save();
      return { isReused: true };
    }
    return { isReused: false };
  };
  
  const archiveRefreshToken = (user, token, req) => {
    user.previousRefreshTokens.push({
      token,
      lastUsedAt: new Date(),
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  };
  
  module.exports = {
    handleTokenReuse,
    archiveRefreshToken,
  };
  