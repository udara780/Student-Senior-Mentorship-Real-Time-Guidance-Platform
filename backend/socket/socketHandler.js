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

  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id} (User: ${socket.user.id})`);

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

        // Broadcast the message to everyone in the room (including sender, or use socket.to().emit to exclude sender)
        // Here we emit to the room, so the client should handle not duplicating their own message if they optimistically rendered it.
        io.to(chatId).emit('receiveMessage', message);
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
