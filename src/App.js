import React, { useState } from 'react';
import JoinForm from './JoinForm';
import Chat from './Chat';

function App() {
  const [user, setUser] = useState(null);

  const handleJoin = (username, room) => {
    const userData = { username, room };
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div>
      {!user ? (
        <JoinForm onJoin={handleJoin} />
      ) : (
        <Chat user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App; 