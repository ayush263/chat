// routes/chat.js
const express = require('express');
const { OpenAI } = require('openai');
const mem = require('../utils/mem');
const requireAuth = require('../utils/auth');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /chat
router.post('/', requireAuth, async (req, res) => {
  try {
    const { message, user_id = 'anon' } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });

    // 1) Pull recent history for this user
    const history = mem.getConv(user_id);

    // 2) Build messages for OpenAI
    const messages = [
      { role: 'system', content: 'Be friendly and concise (1–4 sentences).' },
      ...history,
      { role: 'user', content: message }
    ];

    // 3) Ask OpenAI
    const response = await openai.chat.completions.create({
      model: process.env.MODEL_CHAT || 'gpt-4o-mini',
      messages
    });

    const reply = response.choices?.[0]?.message?.content || 'Hi there!';

    // 4) Save this turn
    mem.addTurn(user_id, message, reply);

    // 5) Return reply
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'something went wrong' });
  }
});

module.exports = router;