const EventEmitter = require('events');
const { getClientIp } = require('./ipUtils');

const securityEvents = new EventEmitter();

const handleTokenReuse = async (user, token) => {
  const reused = user.previousRefreshTokens.find(t => t.token === token);
  
  if (reused) {
    user.currentRefreshToken = null;
    await user.save();

    // Emit event for reuse detected
    securityEvents.emit('tokenReuseDetected', { user, reusedToken: reused });
    
    return { isReused: true };
  }

  return { isReused: false };
};


const archiveRefreshToken = (user, token, req) => {
  user.previousRefreshTokens.push({
    token,
    lastUsedAt: new Date(),
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'],
  });
};


module.exports = {
  handleTokenReuse,
  archiveRefreshToken,
  securityEvents, // export event emitter
};
