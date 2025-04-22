// import express from 'express';
// import cors from 'cors';

// const app = express();

// // Allow cross-origin requests (like from React frontend)
// app.use(cors());

// app.get('/', (req, res) => {
//   res.send('This is your task example');
// });

// app.listen(3000, () => {
//   console.log('Backend is running on http://localhost:3000');
// }); AFTER DATABASE

import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

// Initialize Express
const app = express();

// Set up CORS
app.use(cors());

// Set up PostgreSQL connection
const pool = new Pool({
  user: 'myuser',     // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'mydb',   // Replace with your PostgreSQL database name
  password: 'mypassword',  // Replace with your PostgreSQL password
  port: 5432,
});

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



