// index.js - UPGRADED FOR CASINO AI 🎰
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting - be more generous for casino chat
app.use(rateLimit({ 
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute (increased from 20)
  message: {
    error: 'Too many requests, please slow down gorgeous! 😅'
  }
}));

// Health check (no auth needed)
app.get('/health', (_req, res) => res.json({ 
  ok: true, 
  service: 'Casino AI Host',
  status: 'Ready to charm your players! 🎰',
  timestamp: new Date().toISOString()
}));

// Welcome route
app.get('/', (_req, res) => {
  res.json({
    message: '🎰 Welcome to the Casino AI Host! 💎',
    endpoints: {
      'POST /chat': 'Chat with the AI',
      'GET /memory/:user_id': 'Get user memory',
      'GET /casino/stats': 'Get casino statistics',
      'GET /casino/player/:user_id': 'Get player profile',
      'POST /casino/webhook': 'ManyChat webhook endpoint'
    },
    personas: ['Marcus (Smooth)', 'Sofia (Playful)', 'Victor (Wise)']
  });
});

// Routes
const chatRoutes = require('./routes/chat');
const memoryRoutes = require('./routes/memory');
const casinoRoutes = require('./routes/casino');

app.use('/chat', chatRoutes);
app.use('/memory', memoryRoutes);
app.use('/casino', casinoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Something went wrong on our end!',
    message: 'Our tech team is on it - try again in a moment! 🔧'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'This route doesn\'t exist! Check the main page for available endpoints.',
    availableRoutes: ['/chat', '/memory', '/casino/stats', '/casino/webhook']
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Casino AI Host running on http://localhost:${PORT}`);
  console.log(`🎰 Ready to charm players with Marcus, Sofia, and Victor!`);
  console.log(`💎 ManyChat webhook: http://localhost:${PORT}/casino/webhook`);
});