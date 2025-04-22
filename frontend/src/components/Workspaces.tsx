import React, { useState, useEffect } from 'react';

interface WorkspacesProps {
  userId: number;
}

const Workspaces: React.FC<WorkspacesProps> = ({ userId }) => {
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/workspaces/${userId}`);
      const data = await response.json();
      setWorkspaces(data);
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  };

  const handleCreateWorkspace = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/workspaces/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, userId }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        return;
      }

      fetchWorkspaces();
    } catch (error) {
      console.error('Error creating workspace:', error);
    }
  };

  const handleJoinWorkspace = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/workspaces/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, workspaceId, role: 'member' }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
        return;
      }

      fetchWorkspaces();
    } catch (error) {
      console.error('Error joining workspace:', error);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div>
      <h2>My Workspaces</h2>
      <ul>
        {workspaces.map((workspace: any) => (
          <li key={workspace.id}>{workspace.name}</li>
        ))}
      </ul>
      <h3>Create Workspace</h3>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleCreateWorkspace}>Create</button>
      <h3>Join Workspace</h3>
      <input
        type="text"
        placeholder="Workspace ID"
        value={workspaceId}
        onChange={(e) => setWorkspaceId(e.target.value)}
      />
      <button onClick={handleJoinWorkspace}>Join</button>
    </div>
  );
};

export default Workspaces;