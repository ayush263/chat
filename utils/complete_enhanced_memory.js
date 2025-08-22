// utils/mem.js - ULTRA-HUMAN MEMORY SYSTEM 🧠
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'memory.db');
const PROFILES_PATH = path.join(__dirname, '..', 'profiles.db');
const HUMAN_PATTERNS_PATH = path.join(__dirname, '..', 'human_patterns.db');
const RELATIONSHIP_PATH = path.join(__dirname, '..', 'relationships.db');
const MAX_MESSAGES = 50;

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

function loadHumanPatterns() {
  try {
    return JSON.parse(fs.readFileSync(HUMAN_PATTERNS_PATH, 'utf8'));
  } catch { 
    return { 
      conversation_patterns: {},
      emotional_history: {},
      personality_traits: {},
      communication_style: {},
      life_context_tracking: {}
    }; 
  }
}

function loadRelationships() {
  try {
    return JSON.parse(fs.readFileSync(RELATIONSHIP_PATH, 'utf8'));
  } catch {
    return {
      persona_bonds: {},
      trust_events: {},
      shared_moments: {},
      relationship_milestones: {}
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

function saveHumanPatterns(patterns) {
  try {
    fs.writeFileSync(HUMAN_PATTERNS_PATH, JSON.stringify(patterns, null, 2));
  } catch (error) {
    console.error('Error saving human patterns:', error);
  }
}

function saveRelationships(relationships) {
  try {
    fs.writeFileSync(RELATIONSHIP_PATH, JSON.stringify(relationships, null, 2));
  } catch (error) {
    console.error('Error saving relationships:', error);
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

// BACKWARD COMPATIBILITY FUNCTIONS
function addTurn(userId, userMsg, assistantMsg) {
  return addSocialAdvancedTurn(userId, userMsg, assistantMsg, {});
}

function addAdvancedTurn(userId, userMsg, assistantMsg, metadata = {}) {
  return addSocialAdvancedTurn(userId, userMsg, assistantMsg, metadata);
}

// MAIN ENHANCED TURN FUNCTION
function addSocialAdvancedTurn(userId, userMsg, assistantMsg, metadata = {}) {
  try {
    // Save conversation with rich metadata
    const db = load();
    db[userId] = db[userId] || [];
    
    const timestamp = Date.now();
    const userMsgObj = {
      role: 'user',
      content: userMsg,
      ts: timestamp,
      metadata: {
        length: userMsg.length,
        emotional_indicators: extractEmotionalIndicators(userMsg),
        personal_sharing_level: detectPersonalSharing(userMsg),
        communication_style: analyzeCommStyle(userMsg),
        topics_mentioned: extractTopics(userMsg),
        vulnerability_level: detectVulnerability(userMsg),
        support_seeking: detectSupportSeeking(userMsg)
      }
    };
    
    const assistantMsgObj = {
      role: 'assistant',
      content: assistantMsg,
      ts: timestamp,
      metadata: {
        persona: metadata.persona || 'sofia',
        emotional_response: metadata.emotional_analysis || {},
        response_strategy: metadata.response_strategy || 'standard',
        human_elements: metadata.human_elements || {},
        relationship_building: metadata.relationship_building || false
      }
    };
    
    db[userId].push(userMsgObj, assistantMsgObj);
    
    if (db[userId].length > MAX_MESSAGES) {
      db[userId] = db[userId].slice(-MAX_MESSAGES);
    }
    
    save(db);
    
    // Enhanced learning systems
    updateUltraHumanProfile(userId, userMsg, assistantMsg, metadata);
    learnHumanPatterns(userId, userMsg, assistantMsg, metadata);
    trackRelationshipDynamics(userId, userMsg, assistantMsg, metadata);
    analyzeLifeContext(userId, userMsg, metadata);
    
    console.log(`Saved ultra-human turn for ${userId}`);
  } catch (error) {
    console.error('Error in addSocialAdvancedTurn:', error);
  }
}

// EXTRACT EMOTIONAL INDICATORS
function extractEmotionalIndicators(message) {
  const lowerMsg = message.toLowerCase();
  const indicators = [];
  
  const emotionalMarkers = {
    frustrated: ['fuck', 'shit', 'damn', 'pissed', 'annoyed', 'angry', 'hate', 'sucks'],
    sad: ['sad', 'depressed', 'down', 'hurt', 'crying', 'broken', 'devastated'],
    excited: ['amazing', 'awesome', 'great', 'fantastic', 'love', 'perfect', 'best'],
    worried: ['worried', 'scared', 'nervous', 'anxious', 'stress', 'pressure'],
    lonely: ['alone', 'lonely', 'isolated', 'empty', 'nobody', 'missing'],
    hopeful: ['hopeful', 'excited', 'looking forward', 'can\'t wait', 'optimistic']
  };
  
  Object.entries(emotionalMarkers).forEach(([emotion, words]) => {
    words.forEach(word => {
      if (lowerMsg.includes(word)) {
        indicators.push({
          emotion,
          word,
          confidence: lowerMsg.split(' ').includes(word) ? 0.8 : 0.6
        });
      }
    });
  });
  
  return indicators;
}

// DETECT PERSONAL SHARING LEVEL
function detectPersonalSharing(message) {
  const lowerMsg = message.toLowerCase();
  const personalIndicators = {
    high: ['my family', 'my relationship', 'my depression', 'my anxiety', 'i feel', 'i\'m scared'],
    medium: ['my job', 'my work', 'my boss', 'my money', 'i think', 'i believe'],
    low: ['my day', 'my mood', 'i like', 'i want', 'i need']
  };
  
  for (const [level, indicators] of Object.entries(personalIndicators)) {
    if (indicators.some(indicator => lowerMsg.includes(indicator))) {
      return level;
    }
  }
  
  return 'none';
}

// ANALYZE COMMUNICATION STYLE
function analyzeCommStyle(message) {
  const style = {
    formality: message.includes('please') || message.includes('thank you') ? 'formal' : 'casual',
    directness: message.includes('?') ? 'questioning' : 'stating',
    emotional_expression: extractEmotionalIndicators(message).length > 0 ? 'expressive' : 'reserved',
    length_preference: message.length > 100 ? 'detailed' : message.length > 30 ? 'moderate' : 'brief'
  };
  
  return style;
}

// EXTRACT CONVERSATION TOPICS
function extractTopics(message) {
  const lowerMsg = message.toLowerCase();
  const topics = [];
  
  const topicKeywords = {
    work: ['job', 'work', 'boss', 'office', 'career', 'fired', 'hired', 'interview'],
    family: ['family', 'mom', 'dad', 'parents', 'kids', 'children', 'sister', 'brother'],
    relationships: ['boyfriend', 'girlfriend', 'wife', 'husband', 'dating', 'relationship', 'love'],
    money: ['money', 'bills', 'rent', 'broke', 'expensive', 'budget', 'financial'],
    health: ['sick', 'doctor', 'hospital', 'health', 'medicine', 'pain', 'tired'],
    emotions: ['feel', 'feeling', 'emotion', 'mood', 'depressed', 'happy', 'sad'],
    gaming: ['game', 'play', 'slots', 'casino', 'win', 'lose', 'bet', 'gambling']
  };
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => lowerMsg.includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics;
}

// DETECT VULNERABILITY LEVEL
function detectVulnerability(message) {
  const vulnerabilityMarkers = [
    'i don\'t know what to do', 'i\'m scared', 'i\'m lost', 'help me',
    'i feel alone', 'nobody understands', 'i can\'t handle', 'i\'m struggling'
  ];
  
  const lowerMsg = message.toLowerCase();
  const vulnerabilityScore = vulnerabilityMarkers.reduce((score, marker) => {
    return lowerMsg.includes(marker) ? score + 1 : score;
  }, 0);
  
  if (vulnerabilityScore > 2) return 'high';
  if (vulnerabilityScore > 0) return 'medium';
  return 'low';
}

// DETECT SUPPORT SEEKING
function detectSupportSeeking(message) {
  const supportIndicators = [
    'advice', 'help', 'what should i do', 'tell me', 'think i should',
    'any ideas', 'suggestions', 'opinion', 'thoughts'
  ];
  
  const lowerMsg = message.toLowerCase();
  return supportIndicators.some(indicator => lowerMsg.includes(indicator));
}

// UPDATE ULTRA-HUMAN PROFILE
function updateUltraHumanProfile(userId, userMsg, assistantMsg, metadata) {
  try {
    const profiles = loadProfiles();
    
    if (!profiles[userId]) {
      profiles[userId] = createNewHumanProfile();
    }
    
    const profile = profiles[userId];
    profile.totalChats++;
    profile.lastActive = Date.now();
    
    const lowerMsg = userMsg.toLowerCase();
    const emotionalIndicators = extractEmotionalIndicators(userMsg);
    const personalSharingLevel = detectPersonalSharing(userMsg);
    const topics = extractTopics(userMsg);
    
    // EMOTIONAL PATTERN TRACKING
    if (emotionalIndicators.length > 0) {
      profile.emotional_journey.push({
        timestamp: Date.now(),
        emotions: emotionalIndicators,
        context: userMsg.substring(0, 100),
        persona_present: metadata.persona,
        support_provided: metadata.emotional_response?.support_provided || false
      });
      
      // Keep last 25 emotional events
      if (profile.emotional_journey.length > 25) {
        profile.emotional_journey = profile.emotional_journey.slice(-25);
      }
    }
    
    // PERSONAL STORY COLLECTION
    if (personalSharingLevel === 'high' || personalSharingLevel === 'medium') {
      profile.personal_stories.push({
        category: topics[0] || 'general',
        content: userMsg,
        sharing_level: personalSharingLevel,
        vulnerability_level: detectVulnerability(userMsg),
        timestamp: Date.now(),
        persona_context: metadata.persona,
        follow_up_needed: emotionalIndicators.some(e => ['sad', 'worried', 'frustrated'].includes(e.emotion))
      });
      
      // Keep last 15 personal stories
      if (profile.personal_stories.length > 15) {
        profile.personal_stories = profile.personal_stories.slice(-15);
      }
    }
    
    // LIFE CONTEXT UPDATES
    updateLifeContext(profile, userMsg, topics, emotionalIndicators);
    
    // COMMUNICATION STYLE LEARNING
    const commStyle = analyzeCommStyle(userMsg);
    profile.communication_preferences = {
      ...profile.communication_preferences,
      formality: commStyle.formality,
      typical_length: commStyle.length_preference,
      emotional_expression: commStyle.emotional_expression,
      directness: commStyle.directness
    };
    
    // RELATIONSHIP SCORING
    updateRelationshipScores(profile, metadata, emotionalIndicators, personalSharingLevel);
    
    saveProfiles(profiles);
  } catch (error) {
    console.error('Error updating ultra-human profile:', error);
  }
}

// CREATE NEW HUMAN PROFILE
function createNewHumanProfile() {
  return {
    // Basic info
    name: '', firstSeen: Date.now(), totalChats: 0, lastActive: Date.now(),
    
    // Emotional intelligence
    emotional_journey: [],
    typical_emotional_state: 'neutral',
    emotional_volatility: 'stable',
    support_responsiveness: 'unknown',
    
    // Personal life tracking
    personal_stories: [],
    life_context: {
      work_situation: {},
      family_situation: {},
      relationship_status: {},
      financial_status: {},
      health_status: {}
    },
    
    // Communication patterns
    communication_preferences: {
      greeting_style: 'unknown',
      formality: 'casual',
      typical_length: 'moderate',
      emotional_expression: 'moderate',
      directness: 'moderate'
    },
    
    // Relationship building
    persona_relationships: {
      marcus: { trust_level: 0, interactions: 0, positive_responses: 0, personal_shares: 0 },
      sofia: { trust_level: 0, interactions: 0, positive_responses: 0, personal_shares: 0 },
      victor: { trust_level: 0, interactions: 0, positive_responses: 0, personal_shares: 0 }
    },
    preferred_persona: null,
    relationship_depth: 'stranger',
    
    // Behavioral predictions
    likely_triggers: [],
    support_patterns: [],
    conversation_preferences: [],
    gaming_readiness_patterns: [],
    
    // Scores
    trust_score: 0,
    engagement_score: 50,
    emotional_openness: 0,
    loyalty_score: 0
  };
}

// UPDATE LIFE CONTEXT
function updateLifeContext(profile, userMsg, topics, emotionalIndicators) {
  const lowerMsg = userMsg.toLowerCase();
  
  // Work context
  if (topics.includes('work')) {
    const workContext = profile.life_context.work_situation;
    
    if (lowerMsg.includes('fired') || lowerMsg.includes('lost my job')) {
      workContext.status = 'unemployed';
      workContext.recent_change = 'job_loss';
      workContext.stress_level = 'high';
    } else if (lowerMsg.includes('new job') || lowerMsg.includes('hired')) {
      workContext.status = 'employed';
      workContext.recent_change = 'new_job';
      workContext.stress_level = 'low';
    } else if (lowerMsg.includes('boss') && emotionalIndicators.some(e => e.emotion === 'frustrated')) {
      workContext.boss_relationship = 'problematic';
      workContext.stress_level = 'medium';
    }
    
    workContext.last_mentioned = Date.now();
  }
  
  // Family context
  if (topics.includes('family')) {
    const familyContext = profile.life_context.family_situation;
    
    if (lowerMsg.includes('mom') || lowerMsg.includes('mother')) {
      familyContext.mother_mentioned = true;
      if (emotionalIndicators.some(e => ['worried', 'sad'].includes(e.emotion))) {
        familyContext.mother_concern = true;
      }
    }
    
    familyContext.last_mentioned = Date.now();
  }
  
  // Financial context
  if (topics.includes('money')) {
    const financialContext = profile.life_context.financial_status;
    
    if (lowerMsg.includes('broke') || lowerMsg.includes('bills')) {
      financialContext.pressure_level = 'high';
      financialContext.status = 'struggling';
    }
    
    financialContext.last_mentioned = Date.now();
  }
}

// UPDATE RELATIONSHIP SCORES
function updateRelationshipScores(profile, metadata, emotionalIndicators, personalSharingLevel) {
  const persona = metadata.persona;
  if (!persona || !profile.persona_relationships[persona]) return;
  
  const relationship = profile.persona_relationships[persona];
  relationship.interactions++;
  
  // Track personal sharing
  if (personalSharingLevel === 'high' || personalSharingLevel === 'medium') {
    relationship.personal_shares++;
    relationship.trust_level = Math.min(relationship.trust_level + 5, 100);
  }
  
  // Track emotional support
  if (emotionalIndicators.length > 0 && metadata.emotional_response?.support_provided) {
    relationship.trust_level = Math.min(relationship.trust_level + 3, 100);
  }
  
  // Update overall relationship depth
  const maxTrust = Math.max(...Object.values(profile.persona_relationships).map(r => r.trust_level));
  if (maxTrust > 80) profile.relationship_depth = 'close_friend';
  else if (maxTrust > 60) profile.relationship_depth = 'trusted_friend';
  else if (maxTrust > 40) profile.relationship_depth = 'friend';
  else if (maxTrust > 20) profile.relationship_depth = 'acquaintance';
  
  // Set preferred persona
  const bestPersona = Object.entries(profile.persona_relationships)
    .sort(([,a], [,b]) => b.trust_level - a.trust_level)[0];
  
  if (bestPersona && bestPersona[1].trust_level > 30) {
    profile.preferred_persona = bestPersona[0];
  }
}

// LEARN HUMAN PATTERNS
function learnHumanPatterns(userId, userMsg, assistantMsg, metadata) {
  try {
    const patterns = loadHumanPatterns();
    
    if (!patterns.conversation_patterns[userId]) {
      patterns.conversation_patterns[userId] = {
        greeting_responses: [],
        emotional_triggers: [],
        topic_preferences: [],
        conversation_rhythm: {},
        support_response_patterns: []
      };
    }
    
    const userPatterns = patterns.conversation_patterns[userId];
    
    // Learn greeting patterns
    if (userMsg.length < 30 && !userMsg.includes('?')) {
      userPatterns.greeting_responses.push({
        greeting: userMsg,
        time_of_day: new Date().getHours(),
        persona_responded: metadata.persona,
        timestamp: Date.now()
      });
    }
    
    // Learn emotional triggers
    const emotionalIndicators = extractEmotionalIndicators(userMsg);
    if (emotionalIndicators.length > 0) {
      userPatterns.emotional_triggers.push({
        trigger_content: userMsg.substring(0, 50),
        emotions: emotionalIndicators,
        context: extractTopics(userMsg),
        timestamp: Date.now()
      });
    }
    
    saveHumanPatterns(patterns);
  } catch (error) {
    console.error('Error learning human patterns:', error);
  }
}

// TRACK RELATIONSHIP DYNAMICS
function trackRelationshipDynamics(userId, userMsg, assistantMsg, metadata) {
  try {
    const relationships = loadRelationships();
    
    if (!relationships.persona_bonds[userId]) {
      relationships.persona_bonds[userId] = {};
    }
    
    const persona = metadata.persona;
    if (!relationships.persona_bonds[userId][persona]) {
      relationships.persona_bonds[userId][persona] = {
        first_interaction: Date.now(),
        conversation_count: 0,
        trust_building_events: [],
        shared_moments: [],
        relationship_milestones: []
      };
    }
    
    const bond = relationships.persona_bonds[userId][persona];
    bond.conversation_count++;
    
    // Track trust building events
    const personalSharingLevel = detectPersonalSharing(userMsg);
    if (personalSharingLevel === 'high') {
      bond.trust_building_events.push({
        event: 'high_personal_sharing',
        content: userMsg.substring(0, 100),
        timestamp: Date.now()
      });
    }
    
    // Track shared moments
    const emotionalIndicators = extractEmotionalIndicators(userMsg);
    if (emotionalIndicators.length > 0) {
      bond.shared_moments.push({
        type: 'emotional_support',
        user_emotion: emotionalIndicators[0]?.emotion,
        ai_response_strategy: metadata.response_strategy,
        timestamp: Date.now()
      });
    }
    
    saveRelationships(relationships);
  } catch (error) {
    console.error('Error tracking relationship dynamics:', error);
  }
}

// ANALYZE LIFE CONTEXT
function analyzeLifeContext(userId, userMsg, metadata) {
  try {
    const patterns = loadHumanPatterns();
    
    if (!patterns.life_context_tracking[userId]) {
      patterns.life_context_tracking[userId] = {
        major_life_events: [],
        ongoing_situations: [],
        stress_patterns: [],
        support_needs: []
      };
    }
    
    const lifeTracking = patterns.life_context_tracking[userId];
    const lowerMsg = userMsg.toLowerCase();
    
    // Detect major life events
    const majorEvents = [
      { keywords: ['fired', 'lost my job'], event: 'job_loss' },
      { keywords: ['new job', 'got hired'], event: 'new_job' },
      { keywords: ['broke up', 'relationship ended'], event: 'breakup' },
      { keywords: ['moved', 'new place'], event: 'relocation' },
      { keywords: ['died', 'passed away'], event: 'loss' }
    ];
    
    majorEvents.forEach(({ keywords, event }) => {
      if (keywords.some(keyword => lowerMsg.includes(keyword))) {
        lifeTracking.major_life_events.push({
          event,
          timestamp: Date.now(),
          context: userMsg.substring(0, 100),
          emotional_impact: extractEmotionalIndicators(userMsg)
        });
      }
    });
    
    saveHumanPatterns(patterns);
  } catch (error) {
    console.error('Error analyzing life context:', error);
  }
}

// GET PLAYER PROFILE
function getProfile(userId) {
  try {
    const profiles = loadProfiles();
    return profiles[userId] || null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
}

// GET ENHANCED CASINO STATS
function getCasinoStats() {
  try {
    const profiles = loadProfiles();
    const patterns = loadHumanPatterns();
    const relationships = loadRelationships();
    
    const allUsers = Object.keys(profiles);
    const today = new Date().setHours(0,0,0,0);
    const thisWeek = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const stats = {
      overview: {
        total_players: allUsers.length,
        active_today: allUsers.filter(id => profiles[id]?.lastActive > today).length,
        active_this_week: allUsers.filter(id => profiles[id]?.lastActive > thisWeek).length,
        total_conversations: Object.values(profiles).reduce((sum, p) => sum + (p.totalChats || 0), 0)
      },
      
      relationship_health: {
        deep_relationships: allUsers.filter(id => profiles[id]?.relationship_depth === 'close_friend').length,
        trusted_relationships: allUsers.filter(id => profiles[id]?.relationship_depth === 'trusted_friend').length,
        average_trust_score: allUsers.length > 0 ? 
          Object.values(profiles).reduce((sum, p) => sum + (p.trust_score || 0), 0) / allUsers.length : 0
      },
      
      emotional_insights: {
        users_needing_support: allUsers.filter(id => {
          const profile = profiles[id];
          return profile?.emotional_journey?.some(e => 
            ['sad', 'frustrated', 'worried'].some(emotion => 
              e.emotions.some(ei => ei.emotion === emotion)
            ) && Date.now() - e.timestamp < 86400000 // Within 24 hours
          );
        }).length,
        
        users_sharing_personal: allUsers.filter(id => {
          const profile = profiles[id];
          return profile?.personal_stories?.length > 0;
        }).length
      },
      
      persona_effectiveness: calculatePersonaEffectiveness(profiles)
    };
    
    return stats;
  } catch (error) {
    console.error('Error getting casino stats:', error);
    return { overview: {}, relationship_health: {}, emotional_insights: {}, persona_effectiveness: {} };
  }
}

function calculatePersonaEffectiveness(profiles) {
  const personaStats = { marcus: {}, sofia: {}, victor: {} };
  
  Object.values(profiles).forEach(profile => {
    if (profile.persona_relationships) {
      Object.entries(profile.persona_relationships).forEach(([persona, data]) => {
        if (!personaStats[persona].total_interactions) {
          personaStats[persona] = {
            total_interactions: 0,
            average_trust: 0,
            personal_shares: 0,
            user_count: 0
          };
        }
        
        personaStats[persona].total_interactions += data.interactions || 0;
        personaStats[persona].average_trust += data.trust_level || 0;
        personaStats[persona].personal_shares += data.personal_shares || 0;
        personaStats[persona].user_count++;
      });
    }
  });
  
  // Calculate averages
  Object.values(personaStats).forEach(stats => {
    if (stats.user_count > 0) {
      stats.average_trust = stats.average_trust / stats.user_count;
    }
  });
  
  return personaStats;
}

// CLEAR FUNCTIONS
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
    
    const patterns = loadHumanPatterns();
    if (patterns.conversation_patterns[userId]) {
      delete patterns.conversation_patterns[userId];
      delete patterns.life_context_tracking[userId];
      saveHumanPatterns(patterns);
    }
    
    const relationships = loadRelationships();
    if (relationships.persona_bonds[userId]) {
      delete relationships.persona_bonds[userId];
      saveRelationships(relationships);
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
    saveHumanPatterns({ 
      conversation_patterns: {},
      emotional_history: {},
      personality_traits: {},
      communication_style: {},
      life_context_tracking: {}
    });
    saveRelationships({
      persona_bonds: {},
      trust_events: {},
      shared_moments: {},
      relationship_milestones: {}
    });
    console.log('Cleared all data');
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}

// GET ALL DATA FUNCTIONS
function getAll() {
  return load();
}

function getAllProfiles() {
  return loadProfiles();
}

function getAllHumanPatterns() {
  return loadHumanPatterns();
}

function getAllRelationships() {
  return loadRelationships();
}

// EXPORT ALL FUNCTIONS
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
  
  // Enhanced functions
  addSocialAdvancedTurn,
  getAllHumanPatterns,
  getAllRelationships,
  
  // Direct access to loaders
  load,
  loadProfiles,
  loadHumanPatterns,
  loadRelationships
};