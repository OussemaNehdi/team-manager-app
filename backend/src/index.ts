import express from 'express';
import cors from 'cors';
import { pool } from './db';

// Initialize Express
const app = express();

// Set up CORS
app.use(cors());

// Set up PostgreSQL connection


// Route for "Hello World" message
app.get('/', (req, res) => {
  res.send('Hello World from the backend!');
});

// Route for fetching data from the database
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks'); // Replace with your query
    res.json(result.rows);  // Sends the fetched data as JSON
  } catch (error) {
    console.error('Database query error', error);
    res.status(500).send('Error querying the database');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Backend is running on http://localhost:3000');
});



