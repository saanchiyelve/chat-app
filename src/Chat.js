import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Message from './Message';

function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    const newSocket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      timeout: 5000
    });

    // Listen for connection status
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to server');
      
      // Join room after connection
      newSocket.emit('join-room', user.room);
    });
    
    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    // Listen for messages
    newSocket.on('load-messages', (existingMessages) => {
      console.log('Loaded messages:', existingMessages);
      setMessages(existingMessages);
    });

    newSocket.on('receive-message', (newMessage) => {
      console.log('Received message:', newMessage);
      setMessages(prev => [...prev, newMessage]);
    });

    newSocket.on('chat-cleared', () => {
      console.log('Chat cleared');
      setMessages([]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
      newSocket.off('load-messages');
      newSocket.off('receive-message');
      newSocket.off('chat-cleared');
      newSocket.close();
    };
  }, [user.room]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim() || !isConnected || !socket) return;
    
    const newMsg = {
      username: user.username,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      room: user.room
    };
    
    console.log('Sending message:', newMsg);
    socket.emit('send-message', newMsg);
    setText('');
  };

  const handleClear = () => {
    if (!socket) return;
    socket.emit('clear-chat', user.room);
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', height: '80vh' }}>
      <div style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong>Room:</strong> {user.room}
          <span style={{ marginLeft: 10, fontSize: 12, color: isConnected ? '#4caf50' : '#f44336' }}>
            {isConnected ? '● Connected' : '○ Disconnected'}
          </span>
        </div>
        <button onClick={onLogout} style={{ background: 'none', border: 'none', color: '#1976d2', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#f9f9f9' }}>
        {messages.length === 0 ? (
          <div style={{ color: '#888', textAlign: 'center', marginTop: 40 }}>
            {isConnected ? 'No messages yet. Start chatting!' : 'Connecting to server...'}
          </div>
        ) : (
          messages.map((msg, idx) => <Message key={idx} {...msg} isOwnMessage={msg.username === user.username} />)
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', padding: 16, borderTop: '1px solid #eee', background: '#fafafa' }}>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          disabled={!isConnected}
          style={{ flex: 1, padding: 10, fontSize: 16, borderRadius: 4, border: '1px solid #ccc', marginRight: 8, opacity: isConnected ? 1 : 0.6 }}
        />
        <button type="submit" disabled={!isConnected} style={{ padding: '10px 20px', fontSize: 16, borderRadius: 4, background: isConnected ? '#1976d2' : '#ccc', color: '#fff', border: 'none', cursor: isConnected ? 'pointer' : 'not-allowed' }}>
          Send
        </button>
        <button type="button" onClick={handleClear} disabled={!isConnected} style={{ marginLeft: 8, padding: '10px 16px', fontSize: 16, borderRadius: 4, background: isConnected ? '#e53935' : '#ccc', color: '#fff', border: 'none', cursor: isConnected ? 'pointer' : 'not-allowed' }}>
          Clear Chat
        </button>
      </form>
    </div>
  );
}

export default Chat; 