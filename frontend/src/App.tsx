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
    </div>
  );
};

export default App;
