const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS configuration for production
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://*.vercel.app',
  'https://*.railway.app',
  'https://*.netlify.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin matches any allowed pattern
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed.includes('*')) {
        const pattern = allowed.replace('*', '.*');
        return new RegExp(pattern).test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Health check endpoint for Railway
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Chat server is running',
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
}

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
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
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS enabled for: ${allowedOrigins.join(', ')}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
}); 