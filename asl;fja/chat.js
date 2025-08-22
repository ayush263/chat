// routes/chat.js - UPGRADED CASINO VERSION 🎰
const express = require('express');
const OpenAI = require('openai');
const mem = require('../utils/mem');
const requireAuth = require('../utils/auth');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Casino personas - the AI will pick the best one for each player
const PERSONAS = {
  marcus: {
    name: "Marcus",
    prompt: `You are Marcus, a smooth and confident casino host. You're charming, slightly flirty when appropriate, and make everyone feel like a VIP. Use "baby", "gorgeous", "hun" naturally. Keep responses short and engaging like you're texting. Never be robotic.`
  },
  sofia: {
    name: "Sofia", 
    prompt: `You are Sofia, a bubbly and playful casino host. You're fun, energetic, and love using emojis. Call people "babe", "cutie", "honey". You're flirty but classy. Keep it light and entertaining.`
  },
  victor: {
    name: "Victor",
    prompt: `You are Victor, an experienced Vegas veteran. You know all the insider tips and have stories for days. Call people "champ", "kid", "sport". Share casino wisdom and pro tips.`
  }
};

// Analyze player message for mood and context
function analyzePlayer(message, history) {
  const lowerMsg = message.toLowerCase();
  const analysis = {
    mood: 'neutral',
    isNewPlayer: history.length < 6,
    mentionsGames: false,
    wantsTips: false,
    isFlirty: false,
    isExcited: false,
    isDown: false
  };

  // Check for game mentions
  const games = ['slots', 'blackjack', 'poker', 'roulette', 'baccarat'];
  analysis.mentionsGames = games.some(game => lowerMsg.includes(game));

  // Check for tip requests
  analysis.wantsTips = lowerMsg.includes('tip') || lowerMsg.includes('advice') || lowerMsg.includes('help');

  // Check mood
  const excitedWords = ['won', 'win', 'jackpot', 'lucky', 'awesome', 'amazing'];
  const downWords = ['lost', 'losing', 'broke', 'sucks', 'frustrated'];
  const flirtyWords = ['sexy', 'hot', 'beautiful', 'cute', 'gorgeous'];

  analysis.isExcited = excitedWords.some(word => lowerMsg.includes(word));
  analysis.isDown = downWords.some(word => lowerMsg.includes(word));
  analysis.isFlirty = flirtyWords.some(word => lowerMsg.includes(word));

  if (analysis.isExcited) analysis.mood = 'excited';
  if (analysis.isDown) analysis.mood = 'supportive';
  if (analysis.isFlirty) analysis.mood = 'playful';

  return analysis;
}

// Select best persona based on player analysis
function selectPersona(analysis) {
  if (analysis.isNewPlayer) return 'sofia'; // Welcome new players warmly
  if (analysis.isDown) return 'marcus'; // Marcus handles frustrated players
  if (analysis.wantsTips) return 'victor'; // Victor gives the best advice
  if (analysis.isFlirty) return 'sofia'; // Sofia handles flirty conversations
  
  // Random selection for variety
  const personas = ['marcus', 'sofia', 'victor'];
  return personas[Math.floor(Math.random() * personas.length)];
}

// Build enhanced system prompt
function buildSystemPrompt(persona, analysis, userProfile) {
  const base = PERSONAS[persona].prompt;
  
  const context = `
CURRENT SITUATION:
- Player mood: ${analysis.mood}
- New player: ${analysis.isNewPlayer ? 'Yes - be welcoming!' : 'No - they know you'}
- Mentions games: ${analysis.mentionsGames ? 'Yes - engage about games' : 'No'}
- Wants tips: ${analysis.wantsTips ? 'Yes - share wisdom' : 'No'}

CONVERSATION RULES:
1. Keep responses 1-3 sentences MAX
2. Be human, not robotic
3. Match their energy level
4. Reference casino games naturally
5. Flirt only if they seem into it
6. Always be encouraging about their gaming

CASINO KNOWLEDGE:
You know all about slots, blackjack, poker, roulette, baccarat, craps. Share tips, celebrate wins, comfort losses like a real casino host would.

Remember: You're texting them personally, not giving a speech!`;

  return base + context;
}

// Main chat endpoint - UPGRADED FOR CASINO
router.post('/', requireAuth, async (req, res) => {
  try {
    const { message, user_id = 'anon', first_name = '' } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });

    // Get conversation history
    const history = mem.getConv(user_id);
    
    // Analyze this player and message
    const analysis = analyzePlayer(message, history);
    
    // Select best persona for this situation
    const selectedPersona = selectPersona(analysis);
    
    // Build enhanced system prompt
    const systemPrompt = buildSystemPrompt(selectedPersona, analysis, { name: first_name });
    
    // Build messages for OpenAI with recent history (last 10 messages)
    const recentHistory = history.slice(-10);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory,
      { role: 'user', content: message }
    ];

    // Call OpenAI with premium settings
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Use your existing model or upgrade to gpt-4
      messages,
      max_tokens: 150,
      temperature: 0.9, // High creativity
      frequency_penalty: 0.3,
      presence_penalty: 0.3
    });

    const reply = response.choices?.[0]?.message?.content || 'Hey there gorgeous! 😉';

    // Save this conversation turn
    mem.addTurn(user_id, message, reply);

    // Return response in ManyChat format
    res.json({
      version: "v2",
      content: {
        messages: [
          {
            type: "text",
            text: reply
          }
        ]
      },
      // Include debug info for testing
      debug: {
        persona: selectedPersona,
        mood: analysis.mood,
        isNewPlayer: analysis.isNewPlayer
      }
    });

  } catch (err) {
    console.error('Chat error:', err);
    
    // Friendly error responses
    const errorResponses = [
      "Give me one sec babe, just having a quick moment! 😅",
      "Oops! Technical hiccup - I'll be right back gorgeous! ⚡",
      "Hold tight hun, just sorting something out! 🔄"
    ];
    
    res.json({
      version: "v2", 
      content: {
        messages: [
          {
            type: "text",
            text: errorResponses[Math.floor(Math.random() * errorResponses.length)]
          }
        ]
      }
    });
  }
});

// New endpoint: Get player stats
router.get('/stats/:user_id', requireAuth, (req, res) => {
  const { user_id } = req.params;
  const history = mem.getConv(user_id);
  
  res.json({
    user_id,
    totalMessages: history.filter(m => m.role === 'user').length,
    lastActive: history.length > 0 ? history[history.length - 1].ts : null,
    conversationLength: history.length
  });
});

module.exports = router;