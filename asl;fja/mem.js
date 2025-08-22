// utils/mem.js - ENHANCED FOR CASINO PLAYERS 🎰
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'memory.db');
const PROFILES_PATH = path.join(__dirname, '..', 'profiles.db');
const MAX_MESSAGES = 30; // Keep more for better context

// Load conversation history
function load() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Load player profiles 
function loadProfiles() {
  try {
    const raw = fs.readFileSync(PROFILES_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// Save conversation history
function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

// Save player profiles
function saveProfiles(profiles) {
  fs.writeFileSync(PROFILES_PATH, JSON.stringify(profiles, null, 2), 'utf8');
}

// Get conversation for user
function getConv(userId) {
  const db = load();
  return db[userId] ?? [];
}

// Add conversation turn
function addTurn(userId, userMsg, assistantMsg) {
  const db = load();
  db[userId] = db[userId] ?? [];
  
  // Add both messages with timestamps
  db[userId].push({ 
    role: 'user', 
    content: userMsg, 
    ts: Date.now() 
  });
  db[userId].push({ 
    role: 'assistant', 
    content: assistantMsg, 
    ts: Date.now() 
  });
  
  // Keep recent messages only
  if (db[userId].length > MAX_MESSAGES) {
    db[userId] = db[userId].slice(-MAX_MESSAGES);
  }
  
  save(db);
  
  // Update player profile based on this conversation
  updatePlayerProfile(userId, userMsg, assistantMsg);
}

// Update player profile with learning
function updatePlayerProfile(userId, userMsg, assistantMsg) {
  const profiles = loadProfiles();
  
  if (!profiles[userId]) {
    profiles[userId] = {
      firstSeen: Date.now(),
      totalChats: 0,
      favoriteGames: [],
      mood: 'neutral',
      flirtLevel: 'conservative',
      lastActive: Date.now(),
      preferredPersona: null,
      traits: []
    };
  }
  
  const profile = profiles[userId];
  profile.totalChats++;
  profile.lastActive = Date.now();
  
  const lowerMsg = userMsg.toLowerCase();
  
  // Learn favorite games
  const games = ['slots', 'blackjack', 'poker', 'roulette', 'baccarat', 'craps'];
  games.forEach(game => {
    if (lowerMsg.includes(game) && !profile.favoriteGames.includes(game)) {
      profile.favoriteGames.push(game);
    }
  });
  
  // Detect flirt comfort level
  const flirtyWords = ['thanks babe', 'thanks hun', 'you too', 'love you'];
  const coldWords = ['stop', 'inappropriate', 'professional'];
  
  if (flirtyWords.some(word => lowerMsg.includes(word))) {
    profile.flirtLevel = 'receptive';
  }
  if (coldWords.some(word => lowerMsg.includes(word))) {
    profile.flirtLevel = 'conservative';
  }
  
  // Detect mood patterns
  const excitedWords = ['won', 'winning', 'jackpot', 'awesome', 'amazing'];
  const downWords = ['lost', 'losing', 'broke', 'frustrated'];
  
  if (excitedWords.some(word => lowerMsg.includes(word))) {
    profile.mood = 'excited';
  }
  if (downWords.some(word => lowerMsg.includes(word))) {
    profile.mood = 'supportive';
  }
  
  // Learn traits from conversation patterns
  if (lowerMsg.includes('tip') || lowerMsg.includes('advice')) {
    if (!profile.traits.includes('wants_tips')) {
      profile.traits.push('wants_tips');
    }
  }
  
  if (userMsg.length > 50) {
    if (!profile.traits.includes('chatty')) {
      profile.traits.push('chatty');
    }
  }
  
  saveProfiles(profiles);
}

// Get player profile
function getProfile(userId) {
  const profiles = loadProfiles();
  return profiles[userId] || null;
}

// Clear conversation for user
function clear(userId) {
  const db = load();
  delete db[userId];
  save(db);
}

// Clear all conversations
function clearAll() {
  save({});
}

// Get all conversations
function getAll() {
  return load();
}

// Get all player profiles
function getAllProfiles() {
  return loadProfiles();
}

// Get player stats
function getPlayerStats(userId) {
  const profile = getProfile(userId);
  const conv = getConv(userId);
  
  if (!profile) return null;
  
  return {
    ...profile,
    recentMessageCount: conv.length,
    daysSinceFirst: Math.floor((Date.now() - profile.firstSeen) / (1000 * 60 * 60 * 24)),
    averageMessageLength: conv
      .filter(m => m.role === 'user')
      .reduce((acc, m) => acc + m.content.length, 0) / Math.max(1, conv.filter(m => m.role === 'user').length)
  };
}

// Get casino-wide stats
function getCasinoStats() {
  const profiles = loadProfiles();
  const allUsers = Object.keys(profiles);
  
  const totalPlayers = allUsers.length;
  const activeToday = allUsers.filter(id => {
    const profile = profiles[id];
    const today = new Date().setHours(0,0,0,0);
    return profile.lastActive > today;
  }).length;
  
  const favoriteGames = {};
  allUsers.forEach(id => {
    profiles[id].favoriteGames?.forEach(game => {
      favoriteGames[game] = (favoriteGames[game] || 0) + 1;
    });
  });
  
  return {
    totalPlayers,
    activeToday,
    totalChats: Object.values(profiles).reduce((sum, p) => sum + p.totalChats, 0),
    favoriteGames,
    flirtLevels: {
      conservative: allUsers.filter(id => profiles[id].flirtLevel === 'conservative').length,
      receptive: allUsers.filter(id => profiles[id].flirtLevel === 'receptive').length
    }
  };
}

module.exports = {
  getConv,
  addTurn,
  getProfile,
  getPlayerStats,
  getCasinoStats,
  getAll,
  getAllProfiles,
  clear,
  clearAll,
};