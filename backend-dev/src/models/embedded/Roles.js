// models/embedded/Roles.js
const { Schema } = require('mongoose');

module.exports = new Schema({
  role: { type: String, enum: ['user', 'admin', 'moderator'], required: true },
  assignedAt: { type: Date, default: Date.now },
  assignedBy: String,
});
