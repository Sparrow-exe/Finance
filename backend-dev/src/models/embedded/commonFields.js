const mongoose = require('mongoose');

module.exports = {
  customId: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  status: { type: String, enum: ['active', 'completed', 'archived'], default: 'active' },
  tags: [String],
  createdBy: String,
  updatedBy: String,
  dateCreated: { type: Date, default: Date.now },
  dateUpdated: { type: Date, default: Date.now },
  notes: String,
};
