import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// PostgreSQL connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

// Routes

// Signup
app.post('/signup', async (req: Request, res: Response): Promise<void> => {
  const { email, password, name } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
      [email, hashedPassword, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating user.' });
  }
});

// Login
app.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required.' });
    return;
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    res.json({ message: 'Login successful', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error logging in.' });
  }
});

// Create Workspace
app.post('/workspaces', async (req: Request, res: Response): Promise<void> => {
  const { name, description, ownerId } = req.body;

  if (!name || !ownerId) {
    res.status(400).json({ error: 'Name and ownerId are required.' });
    return;
  }

  try {
    const result = await pool.query(
      'INSERT INTO workspaces (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
      [name, description, ownerId]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating workspace.' });
  }
});

// Join Workspace
app.post('/workspaces/join', async (req: Request, res: Response): Promise<void> => {
  const { userId, workspaceId } = req.body;

  if (!userId || !workspaceId) {
    res.status(400).json({ error: 'UserId and workspaceId are required.' });
    return;
  }

  try {
    await pool.query(
      'INSERT INTO workspace_memberships (user_id, workspace_id, role) VALUES ($1, $2, $3)',
      [userId, workspaceId, 'member']
    );
    res.status(200).json({ message: 'Joined workspace successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error joining workspace.' });
  }
});

// Get Workspaces for a User
app.get('/workspaces/:userId', async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT w.* FROM workspaces w
       JOIN workspace_memberships wm ON w.id = wm.workspace_id
       WHERE wm.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching workspaces.' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});