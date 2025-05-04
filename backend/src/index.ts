import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { pool } from './db'; // Database connection

const app = express();

app.use(express.json()); // For parsing application/json

// Simple route for checking the server
app.get('/', (req: Request, res: Response): void => {
  res.send('Hello, Team Manager App Backend!');
});


// Login route
app.post('/api/login', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.xx111111' });
        return;
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid email or password.' });
            return;
        }

        res.status(200).json({ id: user.id, email: user.email, name: user.name });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to log in.' });
    }
});


// 1. Registration route (signup)
app.post('/api/register', async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'Email, password, and name are required.' });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );
    res.status(201).json(result.rows[0]); // Return the created user
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ error: 'Failed to register user.' });
  }
});



// 2. Create Workspace route (owner only)
app.post('/api/workspaces/create', async (req: Request, res: Response): Promise<void> => {
  const { name, description, userId } = req.body;

  if (!name || !userId) {
    res.status(400).json({ error: 'Name and userId are required.' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error during workspace creation:', error);
    res.status(500).json({ error: 'Failed to create workspace.' });
  }
});

// 3. Get Workspaces for a User
app.get('/api/workspaces/:userId', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM workspaces WHERE owner_id = $1 OR id IN (
        SELECT workspace_id FROM workspace_memberships WHERE user_id = $1
      )`,
      [userId] //so just to explain this to you basically i selected first the workspaces he own and then the workspaces he is a member in 
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces.' });
  }
});

// 4. Join Workspace route
app.post('/api/workspaces/join', async (req: Request, res: Response): Promise<void> => {
  const { userId, workspaceId } = req.body;

  if (!userId || !workspaceId) {
    res.status(400).json({ error: 'UserId and workspaceId are required.' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO workspace_memberships (user_id, workspace_id, role) VALUES ($1, $2, $3) RETURNING *',
      [userId, workspaceId, 'member']
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error joining workspace:', error);
    res.status(500).json({ error: 'Failed to join workspace.' });
  }
});

// 5. Create Task route (owner only)
app.post('/api/tasks', async (req: Request, res: Response): Promise<void> => {
  const { workspaceId, title, description, deadline } = req.body;

  if (!workspaceId || !title || !deadline) {
    res.status(400).json({ error: 'WorkspaceId, title, and deadline are required.' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO tasks (workspace_id, title, description, deadline) VALUES ($1, $2, $3, $4) RETURNING *',
      [workspaceId, title, description, deadline]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task.' });
  }
});

// 6. Get Tasks for a Workspace
app.get('/api/tasks/:workspaceId', async (req: Request, res: Response): Promise<void> => {
  const { workspaceId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE workspace_id = $1',
      [workspaceId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});