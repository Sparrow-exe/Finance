// src/utils/ipUtils.js

/**
 * Returns the client IP address from the request object.
 * It checks the 'x-forwarded-for' header, then falls back to socket and connection remoteAddress.
 * @param {Object} req - Express request object.
 * @returns {string|undefined} The client IP address or undefined if not found.
 */
exports.getClientIp = (req) => {
  
  return req.headers['x-forwarded-for']?.split(',').shift() ||
         req.socket?.remoteAddress ||
         req.connection?.remoteAddress;
};

