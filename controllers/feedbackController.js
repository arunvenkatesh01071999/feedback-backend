
const Feedback = require('../models/Feedback');
const Vote = require('../models/Vote');
const mongoose = require('mongoose');

exports.listFeedbacks = async (req, res) => {
  try {

    const { status, sort = 'latest', page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let sortObj = { createdAt: -1 };
    if (sort === 'votes') sortObj = { votes_count: -1, createdAt: -1 };

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.max(1, parseInt(limit));
    const feedbacks = await Feedback.find(filter)
      .populate('author', 'name email')
      .sort(sortObj)
      .skip(skip)
      .limit(Math.max(1, parseInt(limit)));

    const total = await Feedback.countDocuments(filter);
    res.json({ total, page: Number(page), limit: Number(limit), data: feedbacks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createFeedback = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const fb = new Feedback({
      title,
      description,
      status: status || 'Planned',
      author: req.user._id
    });
    await fb.save();
    res.status(201).json(fb);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.voteFeedback = async (req, res) => {
  try {
    const userId = req.user._id;
    const feedbackId = req.params.id;

    const feedback = await Feedback.findById(feedbackId);
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });

    const alreadyVoted = await Vote.findOne({ user: userId, feedback: feedbackId });
    if (alreadyVoted) return res.status(400).json({ message: 'You have already voted for this feedback' });

    await Vote.create({ user: userId, feedback: feedbackId });


    feedback.votes_count = (feedback.votes_count || 0) + 1;
    await feedback.save();

    res.json({ message: 'Voted', votes_count: feedback.votes_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status || !['Planned', 'In Progress', 'Completed', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
    res.json(feedback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

