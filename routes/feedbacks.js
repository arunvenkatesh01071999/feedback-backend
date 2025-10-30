const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const auth = require('../middleware/auth');

router.get('/', feedbackController.listFeedbacks);
router.post('/', auth, feedbackController.createFeedback);
router.post('/:id/vote', auth, feedbackController.voteFeedback);
router.put('/:id', auth, feedbackController.updateStatus);

module.exports = router;
