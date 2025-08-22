// utils/mem.js - SOCIAL CASINO MEMORY SYSTEM 🧠
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'memory.db');
const PROFILES_PATH = path.join(__dirname, '..', 'profiles.db');
const SOCIAL_PATH = path.join(__dirname, '..', 'social.db');
const MAX_MESSAGES = 40;

// Safe database loading
function load() {
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
  } catch { return {}; }
}

function loadProfiles() {
  try {
    return JSON.parse(fs.readFileSync(PROFILES_PATH, 'utf8'));
  } catch { return {}; }
}

function loadSocial() {
  try {
    return JSON.parse(fs.readFileSync(SOCIAL_PATH, 'utf8'));
  } catch { 
    return { 
      behavior_patterns: {},
      emotional_tracking: {},
      relationship_depth: {},
      conversation_topics: {}
    }; 
  }
}

// Safe database saving
function save(db) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
}

function saveProfiles(profiles) {
  try {
    fs.writeFileSync(PROFILES_PATH, JSON.stringify(profiles, null, 2));
  } catch (error) {
    console.error('Error saving profiles:', error);
  }
}

function saveSocial(social) {
  try {
    fs.writeFileSync(SOCIAL_PATH, JSON.stringify(social, null, 2));
  } catch (error) {
    console.error('Error saving social data:', error);
  }
}

// Get conversation for user
function getConv(userId) {
  try {
    const db = load();
    return db[userId] || [];
  } catch (error) {
    console.error('Error getting conversation:', error);
    return [];
  }
}

// Basic turn function (backward compatibility)
function addTurn(userId, userMsg, assistantMsg) {
  return addSocialAdvancedTurn(userId, userMsg, assistantMsg, {});
}

// Advanced turn function (backward compatibility)
function addAdvancedTurn(userId, userMsg, assistantMsg, metadata = {}) {
  return addSocialAdvancedTurn(userId, userMsg, assistantMsg, metadata);
}

// SOCIAL ADVANCED TURN WITH FULL LEARNING
function addSocialAdvancedTurn(userId, userMsg, assistantMsg, metadata = {}) {
  try {
    // Save conversation
    const db = load();
    db[userId] = db[userId] || [];
    
    const userMsgObj = {
      role: 'user',
      content: userMsg,
      ts: Date.now(),
      metadata: {
        length: userMsg.length,
        behavior_patterns: metadata.behavior_patterns || {}
      }
    };
    
    const assistantMsgObj = {
      role: 'assistant', 
      content: assistantMsg,
      ts: Date.now(),
      metadata: {
        persona: metadata.persona || 'sofia',
        length: assistantMsg.length,
        social_context: metadata.social_learning || {}
      }
    };
    
    db[userId].push(userMsgObj, assistantMsgObj);
    
    // Keep recent messages
    if (db[userId].length > MAX_MESSAGES) {
      db[userId] = db[userId].slice(-MAX_MESSAGES);
    }
    
    save(db);
    
    // Social learning and profiling
    updateSocialProfile(userId, userMsg, assistantMsg, metadata);
    trackSocialBehavior(userId, userMsg, metadata);
    updateRelationshipData(userId, userMsg, assistantMsg, metadata);
    
    console.log(`Saved social turn for ${userId}`);
  } catch (error) {
    console.error('Error in addSocialAdvancedTurn:', error);
  }
}

// SOCIAL PLAYER PROFILING
function updateSocialProfile(userId, userMsg, assistantMsg, metadata) {
  try {
    const profiles = loadProfiles();
    
    if (!profiles[userId]) {
      profiles[userId] = {
        // Basic info
        name: '', firstSeen: Date.now(), totalChats: 0, lastActive: Date.now(),
        
        // Social characteristics
        loneliness_indicators: [], emotional_patterns: [], conversation_depth_history: [],
        personal_topics_discussed: [], relationship_building_progress: 'new',
        
        // Gaming behavior (secondary)
        favoriteGames: [], gameFrequency: {}, playingStyle: 'casual',
        depositHistory: [], preferredPayments: [],
        
        // Communication style
        averageMessageLength: 0, typical_mood: 'neutral', 
        seeks_connection: false, shares_personal_info: false,
        
        // AI relationship
        preferredPersona: null, personaConnections: {},
        trust_level: 0, emotional_support_needed: false,
        
        // Scoring
        engagement_score: 50, loyalty_score: 50, connection_score: 50,
        
        // Personal details learned
        personalAnecdotes: [], interests: [], life_situation: {},
        support_history: []
      };
    }
    
    const profile = profiles[userId];
    profile.totalChats++;
    profile.lastActive = Date.now();
    
    const lowerMsg = userMsg.toLowerCase();
    const behaviorPatterns = metadata.behavior_patterns || {};
    const socialLearning = metadata.social_learning || {};
    
    // LONELINESS AND CONNECTION TRACKING
    if (behaviorPatterns.loneliness_score > 20) {
      profile.loneliness_indicators.push({
        score: behaviorPatterns.loneliness_score,
        timestamp: Date.now(),
        context: userMsg.substring(0, 50)
      });
      profile.seeks_connection = true;
      
      // Keep only recent 10 loneliness indicators
      if (profile.loneliness_indicators.length > 10) {
        profile.loneliness_indicators = profile.loneliness_indicators.slice(-10);
      }
    }
    
    // EMOTIONAL PATTERN TRACKING
    if (behaviorPatterns.emotional_state && behaviorPatterns.emotional_state !== 'neutral') {
      profile.emotional_patterns.push({
        emotion: behaviorPatterns.emotional_state,
        timestamp: Date.now(),
        conversation_depth: behaviorPatterns.conversation_depth
      });
      
      profile.typical_mood = behaviorPatterns.emotional_state;
      
      // Keep recent 15 emotional patterns
      if (profile.emotional_patterns.length > 15) {
        profile.emotional_patterns = profile.emotional_patterns.slice(-15);
      }
    }
    
    // CONVERSATION DEPTH TRACKING
    profile.conversation_depth_history.push({
      depth: behaviorPatterns.conversation_depth || 'surface',
      timestamp: Date.now(),
      message_length: userMsg.length
    });
    
    if (profile.conversation_depth_history.length > 20) {
      profile.conversation_depth_history = profile.conversation_depth_history.slice(-20);
    }
    
    // PERSONAL INFORMATION DETECTION
    const personalIndicators = [
      'my family', 'my job', 'my work', 'my life', 'my relationship',
      'my wife', 'my husband', 'my kids', 'my children', 'my parents',
      'i work', 'i live', 'i feel', 'my problem', 'my stress'
    ];
    
    personalIndicators.forEach(indicator => {
      if (lowerMsg.includes(indicator)) {
        profile.shares_personal_info = true;
        profile.personalAnecdotes.push({
          content: userMsg,
          timestamp: Date.now(),
          persona_context: metadata.persona,
          topic_type: indicator.replace('my ', '').replace('i ', '')
        });
      }
    });
    
    // Keep only recent 10 personal anecdotes
    if (profile.personalAnecdotes.length > 10) {
      profile.personalAnecdotes = profile.personalAnecdotes.slice(-10);
    }
    
    // INTEREST AND LIFE SITUATION LEARNING
    const interestKeywords = {
      family: ['family', 'kids', 'children', 'wife', 'husband', 'parents'],
      work: ['job', 'work', 'career', 'office', 'boss', 'business'],
      hobbies: ['hobby', 'music', 'sports', 'reading', 'cooking', 'travel'],
      relationships: ['relationship', 'dating', 'love', 'boyfriend', 'girlfriend'],
      health: ['health', 'doctor', 'medicine', 'sick', 'tired', 'stress'],
      financial: ['money', 'bills', 'rent', 'broke', 'expensive', 'budget']
    };
    
    Object.entries(interestKeywords).forEach(([category, keywords]) => {
      if (keywords.some(word => lowerMsg.includes(word))) {
        if (!profile.interests.includes(category)) {
          profile.interests.push(category);
        }
        
        // Track life situation context
        profile.life_situation[category] = {
          mentioned_count: (profile.life_situation[category]?.mentioned_count || 0) + 1,
          last_mentioned: Date.now(),
          emotional_context: behaviorPatterns.emotional_state
        };
      }
    });
    
    // PERSONA RELATIONSHIP BUILDING
    if (metadata.persona) {
      if (!profile.personaConnections[metadata.persona]) {
        profile.personaConnections[metadata.persona] = {
          interactions: 0,
          positive_responses: 0,
          personal_conversations: 0,
          support_provided: 0,
          relationship_depth: 'new'
        };
      }
      
      const connection = profile.personaConnections[metadata.persona];
      connection.interactions++;
      
      // Track personal conversation depth
      if (behaviorPatterns.conversation_depth === 'personal' || behaviorPatterns.conversation_depth === 'deep') {
        connection.personal_conversations++;
      }
      
      // Track support provided
      if (behaviorPatterns.emotional_state === 'sad' || behaviorPatterns.needs_support) {
        connection.support_provided++;
        profile.emotional_support_needed = true;
      }
      
      // Detect positive responses
      const positiveWords = ['thanks', 'thank you', 'great', 'awesome', 'love', 'perfect', 'helpful', 'understand'];
      if (positiveWords.some(word => lowerMsg.includes(word))) {
        connection.positive_responses++;
      }
      
      // Update relationship depth
      const personalRatio = connection.personal_conversations / connection.interactions;
      const positiveRatio = connection.positive_responses / connection.interactions;
      
      if (connection.interactions > 3 && personalRatio > 0.3) {
        connection.relationship_depth = 'getting_personal';
      }
      if (connection.interactions > 8 && positiveRatio > 0.6 && personalRatio > 0.4) {
        connection.relationship_depth = 'trusted_friend';
      }
      if (connection.interactions > 15 && positiveRatio > 0.7 && connection.support_provided > 2) {
        connection.relationship_depth = 'close_confidant';
      }
      
      // Update overall relationship building progress
      const bestConnection = Object.values(profile.personaConnections)
        .sort((a, b) => {
          const scoreA = (a.positive_responses / Math.max(a.interactions, 1)) + (a.personal_conversations * 0.1);
          const scoreB = (b.positive_responses / Math.max(b.interactions, 1)) + (b.personal_conversations * 0.1);
          return scoreB - scoreA;
        })[0];
      
      if (bestConnection) {
        profile.relationship_building_progress = bestConnection.relationship_depth;
      }
      
      // Set preferred persona
      const preferredPersona = Object.entries(profile.personaConnections)
        .sort(([,a], [,b]) => {
          const scoreA = (a.positive_responses / Math.max(a.interactions, 1)) + (a.personal_conversations * 0.1);
          const scoreB = (b.positive_responses / Math.max(b.interactions, 1)) + (b.personal_conversations * 0.1);
          return scoreB - scoreA;
        })[0];
      
      if (preferredPersona && preferredPersona[1].interactions > 3) {
        profile.preferredPersona = preferredPersona[0];
      }
    }
    
    // COMMUNICATION STYLE LEARNING
    profile.averageMessageLength = (profile.averageMessageLength * (profile.totalChats - 1) + userMsg.length) / profile.totalChats;
    
    // SCORING UPDATES
    // Connection score based on personal sharing and relationship depth
    if (profile.shares_personal_info) profile.connection_score = Math.min(profile.connection_score + 3, 100);
    if (behaviorPatterns.conversation_depth === 'deep') profile.connection_score = Math.min(profile.connection_score + 5, 100);
    if (behaviorPatterns.seeks_connection) profile.connection_score = Math.min(profile.connection_score + 2, 100);
    
    // Engagement score
    if (userMsg.length > 50) profile.engagement_score = Math.min(profile.engagement_score + 2, 100);
    if (behaviorPatterns.conversation_depth !== 'surface') profile.engagement_score = Math.min(profile.engagement_score + 3, 100);
    
    // Loyalty score
    if (profile.totalChats > 5) profile.loyalty_score = Math.min(profile.loyalty_score + 1, 100);
    if (profile.personalAnecdotes.length > 3) profile.loyalty_score = Math.min(profile.loyalty_score + 2, 100);
    
    // Trust level calculation
    profile.trust_level = Math.min(
      (profile.connection_score * 0.4) + 
      (profile.engagement_score * 0.3) + 
      (profile.loyalty_score * 0.3), 
      100
    );
    
    saveProfiles(profiles);
  } catch (error) {
    console.error('Error updating social profile:', error);
  }
}

// SOCIAL BEHAVIOR TRACKING
function trackSocialBehavior(userId, userMsg, metadata) {
  try {
    const social = loadSocial();
    
    if (!social.behavior_patterns[userId]) {
      social.behavior_patterns[userId] = {
        loneliness_episodes: [],
        emotional_states: [],
        conversation_preferences: {},
        support_requests: [],
        gaming_motivation_analysis: {}
      };
    }
    
    const behaviorData = social.behavior_patterns[userId];
    const patterns = metadata.behavior_patterns || {};
    
    // Track loneliness episodes
    if (patterns.loneliness_score > 30) {
      behaviorData.loneliness_episodes.push({
        score: patterns.loneliness_score,
        timestamp: Date.now(),
        context: userMsg.substring(0, 100)
      });
      
      // Keep recent 15 episodes
      if (behaviorData.loneliness_episodes.length > 15) {
        behaviorData.loneliness_episodes = behaviorData.loneliness_episodes.slice(-15);
      }
    }
    
    // Track emotional states over time
    if (patterns.emotional_state && patterns.emotional_state !== 'neutral') {
      behaviorData.emotional_states.push({
        state: patterns.emotional_state,
        intensity: patterns.loneliness_score || 0,
        timestamp: Date.now(),
        conversation_depth: patterns.conversation_depth
      });
      
      // Keep recent 25 emotional states
      if (behaviorData.emotional_states.length > 25) {
        behaviorData.emotional_states = behaviorData.emotional_states.slice(-25);
      }
    }
    
    // Track conversation preferences
    const prefKey = patterns.conversation_depth || 'surface';
    behaviorData.conversation_preferences[prefKey] = (behaviorData.conversation_preferences[prefKey] || 0) + 1;
    
    // Track support requests
    if (patterns.needs_support || patterns.emotional_state === 'sad') {
      behaviorData.support_requests.push({
        type: patterns.emotional_state,
        timestamp: Date.now(),
        persona: metadata.persona
      });
    }
    
    saveSocial(social);
  } catch (error) {
    console.error('Error tracking social behavior:', error);
  }
}

// RELATIONSHIP DATA UPDATES
function updateRelationshipData(userId, userMsg, assistantMsg, metadata) {
  try {
    const social = loadSocial();
    
    if (!social.relationship_depth[userId]) {
      social.relationship_depth[userId] = {
        overall_depth: 'new',
        persona_relationships: {},
        conversation_milestones: [],
        trust_building_events: []
      };
    }
    
    const relationshipData = social.relationship_depth[userId];
    const patterns = metadata.behavior_patterns || {};
    
    // Track conversation milestones
    if (patterns.conversation_depth === 'personal' || patterns.conversation_depth === 'deep') {
      relationshipData.conversation_milestones.push({
        depth: patterns.conversation_depth,
        topic: userMsg.substring(0, 50),
        timestamp: Date.now(),
        persona: metadata.persona
      });
      
      // Keep recent 20 milestones
      if (relationshipData.conversation_milestones.length > 20) {
        relationshipData.conversation_milestones = relationshipData.conversation_milestones.slice(-20);
      }
    }
    
    // Track trust building events
    const trustIndicators = ['thank you', 'understand', 'help', 'support', 'listen'];
    if (trustIndicators.some(word => userMsg.toLowerCase().includes(word))) {
      relationshipData.trust_building_events.push({
        event_type: 'gratitude_expressed',
        timestamp: Date.now(),
        persona: metadata.persona,
        context: userMsg.substring(0, 50)
      });
    }
    
    saveSocial(social);
  } catch (error) {
    console.error('Error updating relationship data:', error);
  }
}

// Get player profile
function getProfile(userId) {
  try {
    const profiles = loadProfiles();
    return profiles[userId] || null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
}

// SOCIAL CASINO STATISTICS
function getCasinoStats() {
  try {
    const profiles = loadProfiles();
    const social = loadSocial();
    const allUsers = Object.keys(profiles);
    
    const today = new Date().setHours(0,0,0,0);
    const thisWeek = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const totalPlayers = allUsers.length;
    const activeToday = allUsers.filter(id => profiles[id] && profiles[id].lastActive > today).length;
    const activeThisWeek = allUsers.filter(id => profiles[id] && profiles[id].lastActive > thisWeek).length;
    
    // Social engagement metrics
    const seekingConnection = allUsers.filter(id => profiles[id]?.seeks_connection).length;
    const sharePersonalInfo = allUsers.filter(id => profiles[id]?.shares_personal_info).length;
    const needsSupport = allUsers.filter(id => profiles[id]?.emotional_support_needed).length;
    
    // Relationship depth distribution
    const relationshipDepths = {
      new: allUsers.filter(id => profiles[id]?.relationship_building_progress === 'new').length,
      getting_personal: allUsers.filter(id => profiles[id]?.relationship_building_progress === 'getting_personal').length,
      trusted_friend: allUsers.filter(id => profiles[id]?.relationship_building_progress === 'trusted_friend').length,
      close_confidant: allUsers.filter(id => profiles[id]?.relationship_building_progress === 'close_confidant').length
    };
    
    // Connection scores
    const connectionTiers = {
      high: allUsers.filter(id => (profiles[id]?.connection_score || 0) > 70).length,
      medium: allUsers.filter(id => {
        const score = profiles[id]?.connection_score || 0;
        return score > 40 && score <= 70;
      }).length,
      low: allUsers.filter(id => (profiles[id]?.connection_score || 0) <= 40).length
    };
    
    return {
      overview: {
        totalPlayers,
        activeToday,
        activeThisWeek,
        totalConversations: Object.values(profiles).reduce((sum, p) => sum + (p.totalChats || 0), 0)
      },
      social_metrics: {
        seeking_connection: seekingConnection,
        sharing_personal_info: sharePersonalInfo,
        needing_support: needsSupport,
        avg_trust_level: allUsers.length > 0 ? 
          Object.values(profiles).reduce((sum, p) => sum + (p.trust_level || 0), 0) / allUsers.length : 0
      },
      relationship_depths: relationshipDepths,
      connection_tiers: connectionTiers,
      persona_effectiveness: calculatePersonaEffectiveness(profiles)
    };
  } catch (error) {
    console.error('Error getting social casino stats:', error);
    return {
      overview: { totalPlayers: 0, activeToday: 0, activeThisWeek: 0, totalConversations: 0 },
      social_metrics: { seeking_connection: 0, sharing_personal_info: 0, needing_support: 0, avg_trust_level: 0 },
      relationship_depths: { new: 0, getting_personal: 0, trusted_friend: 0, close_confidant: 0 },
      connection_tiers: { high: 0, medium: 0, low: 0 }
    };
  }
}

function calculatePersonaEffectiveness(profiles) {
  const personaStats = { marcus: {}, sofia: {}, victor: {} };
  
  Object.values(profiles).forEach(profile => {
    if (profile.personaConnections) {
      Object.entries(profile.personaConnections).forEach(([persona, data]) => {
        if (!personaStats[persona]) personaStats[persona] = { interactions: 0, positive_rate: 0, personal_convs: 0 };
        
        personaStats[persona].interactions += data.interactions || 0;
        personaStats[persona].positive_rate += (data.positive_responses || 0) / Math.max(data.interactions || 1, 1);
        personaStats[persona].personal_convs += data.personal_conversations || 0;
      });
    }
  });
  
  return personaStats;
}

// Clear functions
function clear(userId) {
  try {
    const db = load();
    delete db[userId];
    save(db);
    
    const profiles = loadProfiles();
    if (profiles[userId]) {
      delete profiles[userId];
      saveProfiles(profiles);
    }
    
    const social = loadSocial();
    if (social.behavior_patterns[userId]) {
      delete social.behavior_patterns[userId];
      delete social.relationship_depth[userId];
      saveSocial(social);
    }
    
    console.log(`Cleared all data for ${userId}`);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
}

function clearAll() {
  try {
    save({});
    saveProfiles({});
    saveSocial({ behavior_patterns: {}, emotional_tracking: {}, relationship_depth: {}, conversation_topics: {} });
    console.log('Cleared all data');
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}

// Get all data functions
function getAll() {
  return load();
}

function getAllProfiles() {
  return loadProfiles();
}

function getAllSocial() {
  return loadSocial();
}

// Export all functions
module.exports = {
  // Basic functions (backward compatibility)
  getConv,
  addTurn,
  getProfile,
  getCasinoStats,
  getAll,
  getAllProfiles,
  clear,
  clearAll,
  
  // Advanced functions (backward compatibility)
  addAdvancedTurn,
  
  // Social functions
  addSocialAdvancedTurn,
  getAllSocial,
  
  // Direct access
  load,
  loadProfiles,
  loadSocial
};