import express from 'express';
import 'dotenv/config';

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Simple calculation API
app.post('/calculate', (req, res) => {
  const { operation, a, b } = req.body;
  
  if (!operation || a === undefined || b === undefined) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  let result;
  switch (operation) {
    case 'add':
      result = a + b;
      break;
    case 'subtract':
      result = a - b;
      break;
    case 'multiply':
      result = a * b;
      break;
    case 'divide':
      if (b === 0) {
        return res.status(400).json({ error: 'Cannot divide by zero' });
      }
      result = a / b;
      break;
    default:
      return res.status(400).json({ error: 'Invalid operation' });
  }
  
  res.json({ result });
});

// Users API (mock data)
const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' }
];

app.get('/users', (req, res) => {
  res.json({ users });
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  console.log(user);
  console.log("hellowordddd");
  res.json({ user });
});

const PORT = process.env.PORT || 3000;


// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;