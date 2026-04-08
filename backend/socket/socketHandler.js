const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

module.exports = (io) => {
  // Middleware for Socket Authentication
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id: userId, iat, exp }
      next();
    } catch (err) {
      return next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`🔌 Socket connected: ${socket.id} (User: ${socket.user.id})`);

    // ── Auto-join ALL of this user's chat rooms on connect ────────────────────
    // This ensures background messages trigger the unread dot even when the
    // user hasn't explicitly opened that conversation.
    try {
      const userChats = await Chat.find({
        $or: [{ student: socket.user.id }, { senior: socket.user.id }],
      }).select('_id');

      userChats.forEach(chat => {
        socket.join(chat._id.toString());
      });

      console.log(`📋 User ${socket.user.id} auto-joined ${userChats.length} chat room(s)`);
    } catch (err) {
      console.error('Auto-join chats error:', err.message);
    }

    // Join a specific chat room
    socket.on('joinChat', async (chatId) => {
      try {
        // Optional security: Verify user belongs to the chat room
        const chat = await Chat.findById(chatId);
        if (!chat) return;

        if (
          chat.student.toString() !== socket.user.id &&
          chat.senior.toString() !== socket.user.id
        ) {
          console.log(`User ${socket.user.id} denied access to chat ${chatId}`);
          return;
        }

        socket.join(chatId);
        console.log(`👤 User ${socket.user.id} joined Chat Room: ${chatId}`);
      } catch (error) {
        console.error('Socket join error:', error);
      }
    });

    // Handle sending new messages
    socket.on('sendMessage', async ({ chatId, content }) => {
      try {
        if (!content || !content.trim()) return;

        // Save message to DB
        const message = await Message.create({
          chat: chatId,
          sender: socket.user.id,
          content: content.trim(),
        });

        // Populate sender so receivers get name + photo immediately
        // Use .toObject() + manual string cast on chat so frontend comparison is reliable
        const populated = await Message.findById(message._id).populate('sender', 'name profilePhoto').lean();
        populated.chat = populated.chat.toString(); // ensure string for frontend chatId comparison

        // Broadcast the populated message to everyone in the room
        io.to(chatId).emit('receiveMessage', populated);
        console.log(`📨 Message sent in Chat ${chatId} by User ${socket.user.id}`);
      } catch (error) {
        console.error('Socket send message error:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};
