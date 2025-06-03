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
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <header className="bg-primary text-white w-full py-4 shadow-md">
        <h1 className="text-center text-3xl font-bold">Team Manager App</h1>
      </header>
      <main className="flex flex-col items-center justify-center mt-8">
        {!userId ? (
          <div className="space-y-6">
            <Signup setUserId={setUserId} />
            <Login setUserId={setUserId} />
          </div>
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
          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </main>
      <footer className="bg-secondary text-white w-full py-4 mt-auto">
        <p className="text-center text-sm">© 2025 XTeam Manager App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
