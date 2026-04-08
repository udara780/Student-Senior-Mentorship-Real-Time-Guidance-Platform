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

module.exports = {
  getMyChats,
  getChatMessages,
};
