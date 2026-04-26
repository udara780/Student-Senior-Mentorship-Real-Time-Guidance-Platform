const Chat = require('../models/Chat');
const Message = require('../models/Message');

// @route   GET /api/chats
// @desc    Get all chats for the logged-in user (student or senior)
// @access  Private
const getMyChats = async (req, res) => {
  try {
    // Find chats where user is either the student or the senior
    const chats = await Chat.find({
      $or: [{ student: req.user._id }, { senior: req.user._id }],
    })
      .populate('student', 'name email profilePhoto')
      .populate('senior', 'name email profilePhoto')
      .populate('request', 'status createdAt')
      .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error.message);
    res.status(500).json({ message: 'Server error fetching chats' });
  }
};

// @route   GET /api/chats/:chatId/messages
// @desc    Get all messages for a specific chat
// @access  Private
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;

    // Verify chat exists and user is part of it
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (
      chat.student.toString() !== req.user._id.toString() &&
      chat.senior.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this chat' });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name profilePhoto')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error.message);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

// @route   GET /api/chats/unread-count
// @desc    Get total unread message count for the logged-in user
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const chats = await Chat.find({
      $or: [{ student: req.user._id }, { senior: req.user._id }],
    }).select('_id');

    const chatIds = chats.map(c => c._id);

    const count = await Message.countDocuments({
      chat: { $in: chatIds },
      sender: { $ne: req.user._id },
      isRead: false,
    });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get unread count error:', error.message);
    res.status(500).json({ message: 'Server error fetching unread count' });
  }
};

// @route   PUT /api/chats/:chatId/read
// @desc    Mark all messages in a chat as read for the current user
// @access  Private
const markChatAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    if (
      chat.student.toString() !== req.user._id.toString() &&
      chat.senior.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark all messages NOT sent by the current user as read
    await Message.updateMany(
      { chat: chatId, sender: { $ne: req.user._id }, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: 'Chat marked as read' });
  } catch (error) {
    console.error('Mark read error:', error.message);
    res.status(500).json({ message: 'Server error marking chat as read' });
  }
};

module.exports = {
  getMyChats,
  getChatMessages,
  getUnreadCount,
  markChatAsRead,
};
