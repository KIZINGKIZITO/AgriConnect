const express = require('express');
const { getMessages, sendMessage, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const router = express.Router();

router.route('/conversations')
    .get(protect, getConversations);

router.route('/conversations/:conversationId')
    .get(protect, getMessages);

router.route('/')
    .post(protect, sendMessage);

module.exports = router;