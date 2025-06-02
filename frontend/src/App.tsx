import React, { useState } from 'react';
import Signup from './components/Signup';
import Login from './components/Login';
import Workspaces from './components/Workspaces';
import Tasks from './components/Tasks';

const App: React.FC = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);

  return (
    <div>
      <h1>Team Manager App X</h1>
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
