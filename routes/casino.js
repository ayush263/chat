// routes/casino.js - CASINO-SPECIFIC FEATURES 🎰
const express = require('express');
const mem = require('../utils/mem');
const requireAuth = require('../utils/auth');

const router = express.Router();

// GET /casino/stats - Overall casino statistics
router.get('/stats', requireAuth, (req, res) => {
  const stats = mem.getCasinoStats();
  res.json({
    success: true,
    stats: {
      ...stats,
      timestamp: new Date().toISOString()
    }
  });
});

// GET /casino/player/:user_id - Get detailed player profile
router.get('/player/:user_id', requireAuth, (req, res) => {
  const { user_id } = req.params;
  const playerStats = mem.getPlayerStats(user_id);
  
  if (!playerStats) {
    return res.status(404).json({
      success: false,
      error: 'Player not found'
    });
  }
  
  res.json({
    success: true,
    player: playerStats
  });
});

// GET /casino/leaderboard - Most active players
router.get('/leaderboard', requireAuth, (req, res) => {
  const allProfiles = mem.getAllProfiles();
  
  const leaderboard = Object.entries(allProfiles)
    .map(([userId, profile]) => ({
      userId,
      totalChats: profile.totalChats,
      daysSinceFirst: Math.floor((Date.now() - profile.firstSeen) / (1000 * 60 * 60 * 24)),
      favoriteGames: profile.favoriteGames,
      lastActive: profile.lastActive
    }))
    .sort((a, b) => b.totalChats - a.totalChats)
    .slice(0, 10); // Top 10 players
    
  res.json({
    success: true,
    leaderboard
  });
});

// POST /casino/webhook - ManyChat webhook endpoint
router.post('/webhook', async (req, res) => {
  try {
    // This is specifically for ManyChat integration
    const { 
      subscriber_id, 
      last_input_text: message, 
      first_name,
      last_name 
    } = req.body;
    
    if (!subscriber_id || !message) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }
    
    // Forward to your chat endpoint (internal call)
    const chatResponse = await forwardToChat({
      user_id: subscriber_id,
      message: message,
      first_name: first_name || '',
      last_name: last_name || ''
    });
    
    // Return in ManyChat format
    res.json(chatResponse);
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      version: "v2",
      content: {
        messages: [{
          type: "text",
          text: "Hey! Give me just a sec, having a quick technical moment... 😅"
        }]
      }
    });
  }
});

// Internal function to call your chat route
async function forwardToChat(data) {
  // This would normally be an HTTP call, but since we're in the same app:
  const express = require('express');
  const chatRouter = require('./chat');
  
  // Create a mock request/response to use your existing chat logic
  const mockReq = {
    body: data,
    headers: { authorization: `Bearer ${process.env.AUTH_TOKEN}` }
  };
  
  return new Promise((resolve) => {
    const mockRes = {
      json: (data) => resolve(data),
      status: () => mockRes
    };
    
    // This is a bit hacky - in production you'd want to refactor the chat logic
    // into a shared function, but this works for now
    chatRouter.handle(mockReq, mockRes, () => {});
  });
}

// GET /casino/popular-games - Most mentioned games
router.get('/popular-games', requireAuth, (req, res) => {
  const stats = mem.getCasinoStats();
  
  const sortedGames = Object.entries(stats.favoriteGames)
    .sort(([,a], [,b]) => b - a)
    .map(([game, count]) => ({ game, mentions: count }));
    
  res.json({
    success: true,
    popularGames: sortedGames
  });
});

// POST /casino/reset-player/:user_id - Reset a player's profile (admin)
router.post('/reset-player/:user_id', requireAuth, (req, res) => {
  const { user_id } = req.params;
  
  // Clear conversation and profile
  mem.clear(user_id);
  
  res.json({
    success: true,
    message: `Player ${user_id} has been reset`
  });
});

module.exports = router;