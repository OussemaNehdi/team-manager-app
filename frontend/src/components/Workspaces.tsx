import React, { useState, useEffect } from 'react';

interface WorkspacesProps {
  userId: number;
  setSelectedWorkspaceId: (id: number) => void;
}

const Workspaces: React.FC<WorkspacesProps> = ({ userId, setSelectedWorkspaceId }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newWorkspaceDescription, setNewWorkspaceDescription] = useState('');
  const [joinWorkspaceId, setJoinWorkspaceId] = useState('');
  // const REACT_APP = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch(`/api/workspaces/${userId}`);
      const data = await response.json();
      setWorkspaces(data);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  };

  const handleCreateWorkspace = async () => {
    try {
      const response = await fetch('/api/workspaces/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newWorkspaceName,
          description: newWorkspaceDescription,
          userId,
        }),
      });

      if (response.ok) {
        fetchWorkspaces(); // Refresh the workspace list
        setNewWorkspaceName('');
        setNewWorkspaceDescription('');
      } else {
        alert('Failed to create workspace');
      }
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const handleJoinWorkspace = async () => {
    try {
      const response = await fetch('/api/workspaces/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          workspaceId: joinWorkspaceId,
        }),
      });

      if (response.ok) {
        fetchWorkspaces(); // Refresh the workspace list
        setJoinWorkspaceId('');
      } else {
        alert('Failed to join workspace');
      }
    } catch (error) {
      console.error('Error joining workspace:', error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  return (
    <div>
      <h2>My Workspaces</h2>

      {/* Create Workspace Section */}
      <div>
        <h3>Create Workspace</h3>
        <input
          type="text"
          placeholder="Workspace Name"
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Workspace Description"
          value={newWorkspaceDescription}
          onChange={(e) => setNewWorkspaceDescription(e.target.value)}
        />
        <button onClick={handleCreateWorkspace}>Create</button>
      </div>

      {/* Join Workspace Section */}
      <div>
        <h3>Join Workspace</h3>
        <input
          type="text"
          placeholder="Workspace ID"
          value={joinWorkspaceId}
          onChange={(e) => setJoinWorkspaceId(e.target.value)}
        />
        <button onClick={handleJoinWorkspace}>Join</button>
      </div>

      {/* List of Workspaces */}
      <ul>
        {workspaces.map((workspace: any) => (
          <li key={workspace.id}>
            {workspace.name} - {workspace.description}
            <button onClick={() => setSelectedWorkspaceId(workspace.id)}>Enter</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Workspaces;