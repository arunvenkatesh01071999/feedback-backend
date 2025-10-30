const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['Planned', 'In Progress', 'Completed', 'Rejected'], default: 'Planned' },
  votes_count: { type: Number, default: 0 },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

feedbackSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Feedback', feedbackSchema);
