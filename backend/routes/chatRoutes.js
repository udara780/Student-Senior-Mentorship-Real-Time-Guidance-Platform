const express = require('express');
const router = express.Router();
const { getMyChats, getChatMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// GET /api/chats — Get user's chats
router.get('/', protect, getMyChats);

// GET /api/chats/:chatId/messages — Get messages for a chat
router.get('/:chatId/messages', protect, getChatMessages);

module.exports = router;
