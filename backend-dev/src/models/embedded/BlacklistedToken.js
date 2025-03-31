const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlacklistedTokenSchema = new Schema({
  token: { type: String, required: true, unique: true },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  revokedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('BlacklistedToken', BlacklistedTokenSchema);
