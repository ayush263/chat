// routes/memory.js
const express = require('express');
const mem = require('../utils/mem');
const requireAuth = require('../utils/auth');

const router = express.Router();

// GET /memory/:user_id → show stored memory
router.get('/:user_id', requireAuth, (req, res) => {
  const { user_id } = req.params;
  res.json({ history: mem.getConv(user_id) });
});

// DELETE /memory/:user_id → clear memory
router.delete('/:user_id', requireAuth, (req, res) => {
  const { user_id } = req.params;
  mem.clear(user_id);   // <-- this must exist in mem.js
  res.json({ ok: true, cleared: user_id });
});

module.exports = router;