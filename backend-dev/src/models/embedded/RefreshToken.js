// models/embedded/RefreshToken.js
const { Schema } = require('mongoose');

module.exports = new Schema({
  token: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  lastUsedAt: Date,
  ip: String,
  userAgent: String
});
