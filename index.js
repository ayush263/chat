// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 20 }));

// simple health route (no auth)
app.get('/health', (_req, res) => res.json({ ok: true }));

//chat
const chatRoutes = require('./routes/chat');
app.use('/chat', chatRoutes);

//memory
const memoryRoutes = require('./routes/memory');
app.use('/memory', memoryRoutes);


app.listen(PORT, () => {
  console.log(`🚀 server running on http://localhost:${PORT}`);
});