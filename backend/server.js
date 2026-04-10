require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // React Vite dev server
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes (to be added as we implement each phase)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/chats', require('./routes/chatRoutes'));
app.use('/api/sessions', require('./routes/sessionRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/email', require('./routes/emailRoutes'));
app.use('/api/group-requests', require('./routes/groupRequestRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));


// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚀 Mentorship Platform API is running' });
});

// Socket.io handler
require('./socket/socketHandler')(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
