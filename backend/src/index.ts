import express from 'express';
import cors from 'cors';

const app = express();

// Allow cross-origin requests (like from React frontend)
app.use(cors());

app.get('/', (req, res) => {
  res.send('This is your task example');
});

app.listen(3000, () => {
  console.log('Backend is running on http://localhost:3000');
});