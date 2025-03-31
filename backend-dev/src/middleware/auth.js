const jwt = require('jsonwebtoken');
const BlacklistedToken = require('../models/embedded/BlacklistedToken');

const verifyAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No access token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const isRevoked = await BlacklistedToken.findOne({ token });
    if (isRevoked) {
      return res.status(401).json({ message: 'Access token revoked' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Access token expired' });
    }
    return res.status(403).json({ message: 'Invalid access token' });
  }
};

module.exports = verifyAccessToken;
