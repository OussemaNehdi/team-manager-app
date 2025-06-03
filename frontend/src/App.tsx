import React, { useState, useEffect } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import Workspaces from './components/Workspaces';
import Tasks from './components/Tasks';

const App: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);

  // Verify user session on page load
  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await fetch('/api/protected', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setUserId(data.user.id); // Restore user session
        }
      } catch (error) {
        console.error('Error verifying session:', error);
      }
    };

    verifySession();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });
      if (response.ok) {
        setUserId(null); // Clear user session
        setSelectedWorkspaceId(null); // Reset workspace selection
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <h1>Team Manager App</h1>
      {!userId ? (
        <>
          <Signup setUserId={setUserId} />
          <Login setUserId={setUserId} />
        </>
      ) : selectedWorkspaceId ? (
        <Tasks
          userId={userId}
          workspaceId={selectedWorkspaceId}
          setSelectedWorkspaceId={setSelectedWorkspaceId}
        />
      ) : (
        <Workspaces userId={userId} setSelectedWorkspaceId={setSelectedWorkspaceId} />
      )}
      {userId && (
        <button onClick={handleLogout} style={{ marginTop: '20px' }}>
          Logout
        </button>
      )}
    </div>
  );
};

export default App;
