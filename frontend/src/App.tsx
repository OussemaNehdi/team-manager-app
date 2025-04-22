import React, { useState, useEffect } from 'react';
import './App.css';

// Define the structure of a Task (you can modify the type as needed)
interface Task {
  id: number;
  title: string;
  done: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch tasks from the backend
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/tasks');  // Adjust the URL if needed
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError('Error fetching tasks');
    } finally {
      setLoading(false);
    }
  };

  // Effect hook to load tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <h1>Task Manager</h1>

      {loading && <p>Loading tasks...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              <h3>{task.title}</h3>
              <p>----------</p>
              <p>Status: {task.done ? 'Completed' : 'Pending'}</p>
            </li>
          ))
        ) : (
          <p>No tasks available</p>
        )}
      </ul>
    </div>
  );
};

export default App;
