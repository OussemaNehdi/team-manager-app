import React, { useState, useEffect } from 'react';

interface TasksProps {
  userId: number;
  workspaceId: number;
  setSelectedWorkspaceId: (id: null) => void;
}

const Tasks: React.FC<TasksProps> = ({ userId, workspaceId, setSelectedWorkspaceId }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  // const REACT_APP = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/tasks/${workspaceId}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const checkOwnership = async () => {
    try {
      const response = await fetch(`/api/workspaces/${userId}`);
      const data = await response.json();
      const workspace = data.find((w: any) => w.id === workspaceId);
      setIsOwner(workspace?.owner_id === userId);
    } catch (error) {
      console.error('Error checking ownership:', error);
    }
  };

  const handleAddTask = async () => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspaceId, title, description, deadline }),
      });

      if (response.ok) {
        fetchTasks();
        setTitle('');
        setDescription('');
        setDeadline('');
      } else {
        alert('Failed to add task');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    checkOwnership();
  }, [checkOwnership, fetchTasks]);

  return (
    <div>
      <button onClick={() => setSelectedWorkspaceId(null)}>Back to Workspaces</button>
      <h2>Tasks</h2>
      <ul>
        {tasks.map((task: any) => (
          <li key={task.id}>
            {task.title} - {task.description} (Deadline: {task.deadline})
          </li>
        ))}
      </ul>
      {isOwner && (
        <div>
          <h3>Add Task</h3>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
      )}
    </div>
  );
};

export default Tasks;