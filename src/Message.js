import React from 'react';

function Message({ username, text, timestamp, isOwnMessage }) {
  return (
    <div style={{ 
      marginBottom: 12, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: isOwnMessage ? 'flex-end' : 'flex-start'
    }}>
      <div style={{ 
        fontWeight: 'bold', 
        color: isOwnMessage ? '#4caf50' : '#1976d2', 
        fontSize: 14,
        textAlign: isOwnMessage ? 'right' : 'left'
      }}>
        {isOwnMessage ? 'You' : username} 
        <span style={{ color: '#888', fontWeight: 'normal', fontSize: 12, marginLeft: 8 }}>at {timestamp}</span>
      </div>
      <div style={{ 
        fontSize: 16, 
        color: '#222', 
        background: isOwnMessage ? '#e8f5e8' : '#f0f0f0',
        padding: '8px 12px',
        borderRadius: 12,
        maxWidth: '70%',
        wordWrap: 'break-word',
        border: isOwnMessage ? '1px solid #4caf50' : '1px solid #ddd'
      }}>
        {text}
      </div>
    </div>
  );
}

export default Message; 