const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

// Store messages by room
const messages = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a room
  socket.on('join-room', (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
    
    // Send existing messages for this room
    if (messages[room]) {
      console.log(`Sending ${messages[room].length} messages to user ${socket.id} in room ${room}`);
      socket.emit('load-messages', messages[room]);
    } else {
      console.log(`No existing messages for room ${room}`);
      socket.emit('load-messages', []);
    }
  });

  // Handle new message
  socket.on('send-message', (messageData) => {
    const { room, username, text, timestamp } = messageData;
    console.log(`Received message in room ${room}: ${username}: ${text}`);
    
    // Store message
    if (!messages[room]) {
      messages[room] = [];
    }
    messages[room].push(messageData);
    
    // Broadcast to all users in the room
    io.to(room).emit('receive-message', messageData);
    console.log(`Message broadcasted to room ${room}`);
  });

  // Handle clear chat
  socket.on('clear-chat', (room) => {
    messages[room] = [];
    io.to(room).emit('chat-cleared');
    console.log(`Chat cleared in room: ${room}`);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for: http://localhost:3000, http://127.0.0.1:3000`);
}); 