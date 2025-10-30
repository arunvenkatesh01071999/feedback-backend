const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback', required: true },
}, { timestamps: true });

voteSchema.index({ user: 1, feedback: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
