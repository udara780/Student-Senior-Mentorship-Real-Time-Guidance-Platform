const express = require('express');
const router = express.Router();
const { getMyChats, getChatMessages, getUnreadCount, markChatAsRead } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// GET /api/chats — Get user's chats
router.get('/', protect, getMyChats);

// GET /api/chats/unread-count — Get total unread message count (must be before /:chatId)
router.get('/unread-count', protect, getUnreadCount);

// GET /api/chats/:chatId/messages — Get messages for a chat
router.get('/:chatId/messages', protect, getChatMessages);

// PUT /api/chats/:chatId/read — Mark all messages in a chat as read
router.put('/:chatId/read', protect, markChatAsRead);

module.exports = router;
