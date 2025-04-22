import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from './db'; // Database connection

const app = express();
app.use(cors());
app.use(express.json()); // For parsing application/json

// JWT secret key (use environment variables in production)
const JWT_SECRET = 'your-secret-key';

// Simple route for checking the server
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello, Team Manager App Backend!');
});

// 1. Registration route (signup)
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// 2. Login route
app.post('/api/login', async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    // Generate a JWT
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to log in' });
  }
});

// 3. Create Workspace route (owner only)
app.post('/api/workspaces/create', async (req, res) => {
  const { name, description, userId } = req.body; // Assuming userId comes from JWT
  try {
    const result = await pool.query(
      'INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, userId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create workspace' });
  }
});

// 4. Join Workspace route
app.post('/api/workspaces/join', async (req, res) => {
  const { workspaceId, userId, role } = req.body; // Assuming userId comes from JWT
  try {
    const result = await pool.query(
      'INSERT INTO workspace_memberships (user_id, workspace_id, role) VALUES ($1, $2, $3) RETURNING *',
      [userId, workspaceId, role]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to join workspace' });
  }
});

// 5. Create Task route (owner only)
app.post('/api/tasks', async (req, res) => {
  const { workspaceId, title, description, deadline } = req.body; // Assuming userId from JWT
  try {
    const result = await pool.query(
      'INSERT INTO tasks (workspace_id, title, description, deadline) VALUES ($1, $2, $3, $4) RETURNING *',
      [workspaceId, title, description, deadline]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:3000`);
});