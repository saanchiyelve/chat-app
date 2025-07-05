# React Chat App

A real-time chat application built with React and Socket.IO, supporting multiple users in different rooms.

## Features

- ✅ Real-time messaging
- ✅ Room-based chat
- ✅ Multiple users support
- ✅ Connection status indicator
- ✅ Message persistence
- ✅ Clear chat functionality
- ✅ Responsive design

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start both server and client:**
   ```bash
   npm run dev
   ```

3. **Or start separately:**
   ```bash
   # Terminal 1 - Start server
   npm run server
   
   # Terminal 2 - Start client
   npm start
   ```

4. **Open in browser:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## Deployment

### Option 1: Deploy to Vercel (Frontend) + Railway (Backend)

#### Frontend (Vercel):
1. Push code to GitHub
2. Connect to Vercel
3. Deploy automatically

#### Backend (Railway):
1. Create account on [Railway](https://railway.app)
2. Connect your GitHub repo
3. Set environment variables
4. Deploy

### Option 2: Deploy to Heroku

1. **Create Heroku app:**
   ```bash
   heroku create your-chat-app
   ```

2. **Add buildpacks:**
   ```bash
   heroku buildpacks:add heroku/nodejs
   ```

3. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 3: Deploy to DigitalOcean App Platform

1. Connect GitHub repository
2. Configure build settings
3. Deploy with one click

## Environment Variables

Create a `.env` file for production:

```env
PORT=3001
NODE_ENV=production
```

## Usage

1. Enter your username and room name
2. Start chatting with others in the same room
3. Messages appear in real-time
4. Use "Clear Chat" to clear all messages

## Tech Stack

- **Frontend:** React, Socket.IO Client
- **Backend:** Node.js, Express, Socket.IO
- **Deployment:** Vercel, Railway, Heroku

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request