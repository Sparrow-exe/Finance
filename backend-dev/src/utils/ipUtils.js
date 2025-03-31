// src/utils/ipUtils.js
exports.getClientIp = (req) => {
    return req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress;
  };
  