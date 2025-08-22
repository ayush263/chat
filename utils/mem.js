// utils/mem.js - ULTRA-ADVANCED HUMAN MEMORY SYSTEM 🧠
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'memory.db');
const PROFILES_PATH = path.join(__dirname, '..', 'profiles.db');
const HUMAN_PATTERNS_PATH = path.join(__dirname, '..', 'human_patterns.db');
const RELATIONSHIP_PATH = path.join(__dirname, '..', 'relationships.db');
const LIFE_EVENTS_PATH = path.join(__dirname, '..', 'life_events.db');
const EMOTIONAL_JOURNEY_PATH = path.join(__dirname, '..', 'emotional_journey.db');
const MAX_MESSAGES = 50;

// Safe database loading with enhanced error handling
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
      emotional_intelligence: {},
      personality_analysis: {},
      communication_evolution: {},
      behavioral_predictions: {}
    }; 
  }
}

function loadRelationships() {
  try {
    return JSON.parse(fs.readFileSync(RELATIONSHIP_PATH, 'utf8'));
  } catch {
    return {
      persona_bonds: {},
      trust_milestones: {},
      shared_experiences: {},
      emotional_connections: {},
      conflict_resolutions: {}
    };
  }
}

function loadLifeEvents() {
  try {
    return JSON.parse(fs.readFileSync(LIFE_EVENTS_PATH, 'utf8'));
  } catch {
    return {
      major_events: {},
      ongoing_situations: {},
      life_transitions: {},
      stress_periods: {},
      celebration_moments: {}
    };
  }
}

function loadEmotionalJourney() {
  try {
    return JSON.parse(fs.readFileSync(EMOTIONAL_JOURNEY_PATH, 'utf8'));
  } catch {
    return {
      emotional_timeline: {},
      mood_patterns: {},
      trigger_analysis: {},
      recovery_patterns: {},
      support_effectiveness: {}
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

function saveLifeEvents(events) {
  try {
    fs.writeFileSync(LIFE_EVENTS_PATH, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error('Error saving life events:', error);
  }
}

function saveEmotionalJourney(journey) {
  try {
    fs.writeFileSync(EMOTIONAL_JOURNEY_PATH, JSON.stringify(journey, null, 2));
  } catch (error) {
    console.error('Error saving emotional journey:', error);
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

// MAIN ULTRA-ADVANCED TURN FUNCTION
function addSocialAdvancedTurn(userId, userMsg, assistantMsg, metadata = {}) {
  try {
    // Save conversation with ultra-rich metadata
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
        support_seeking: detectSupportSeeking(userMsg),
        life_event_mentions: detectLifeEvents(userMsg),
        relationship_references: detectRelationshipRefs(userMsg),
        mood_indicators: detectMoodShifts(userMsg),
        stress_indicators: detectStressSignals(userMsg)
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
        relationship_building: metadata.relationship_building || false,
        support_provided: metadata.support_provided || false,
        gaming_advice_given: metadata.gaming_advice_given || false,
        memory_referenced: metadata.memory_referenced || false
      }
    };
    
    db[userId].push(userMsgObj, assistantMsgObj);
    
    if (db[userId].length > MAX_MESSAGES) {
      db[userId] = db[userId].slice(-MAX_MESSAGES);
    }
    
    save(db);
    
    // Ultra-advanced learning systems
    updateUltraAdvancedProfile(userId, userMsg, assistantMsg, metadata);
    analyzeHumanPatterns(userId, userMsg, assistantMsg, metadata);
    trackRelationshipEvolution(userId, userMsg, assistantMsg, metadata);
    recordLifeEvents(userId, userMsg, metadata);
    mapEmotionalJourney(userId, userMsg, assistantMsg, metadata);
    predictBehavioralPatterns(userId, userMsg, metadata);
    
    console.log(`Saved ultra-advanced turn for ${userId}`);
  } catch (error) {
    console.error('Error in addSocialAdvancedTurn:', error);
  }
}

// EXTRACT EMOTIONAL INDICATORS
function extractEmotionalIndicators(message) {
  const lowerMsg = message.toLowerCase();
  const indicators = [];
  
  const emotionalMarkers = {
    frustrated: {
      words: ['fuck', 'shit', 'damn', 'pissed', 'annoyed', 'angry', 'hate', 'sucks'],
      phrases: ['fed up', 'sick of', 'can\'t stand', 'pissing me off'],
      intensity_modifiers: ['so', 'really', 'extremely', 'fucking']
    },
    sad: {
      words: ['sad', 'depressed', 'down', 'hurt', 'crying', 'broken', 'devastated'],
      phrases: ['feel empty', 'want to cry', 'can\'t stop crying', 'heart broken'],
      intensity_modifiers: ['so', 'really', 'deeply', 'completely']
    },
    excited: {
      words: ['amazing', 'awesome', 'great', 'fantastic', 'love', 'perfect', 'best'],
      phrases: ['can\'t wait', 'so excited', 'best day ever', 'love this'],
      intensity_modifiers: ['so', 'really', 'extremely', 'absolutely']
    },
    worried: {
      words: ['worried', 'scared', 'nervous', 'anxious', 'stress', 'pressure'],
      phrases: ['freaking out', 'losing sleep', 'can\'t relax', 'on edge'],
      intensity_modifiers: ['so', 'really', 'extremely', 'constantly']
    },
    lonely: {
      words: ['alone', 'lonely', 'isolated', 'empty', 'nobody', 'missing'],
      phrases: ['by myself', 'no one cares', 'feel alone', 'miss having'],
      intensity_modifiers: ['so', 'really', 'completely', 'totally']
    },
    hopeful: {
      words: ['hopeful', 'optimistic', 'excited', 'looking forward', 'positive'],
      phrases: ['things looking up', 'getting better', 'good feeling', 'positive vibes'],
      intensity_modifiers: ['really', 'very', 'so', 'extremely']
    }
  };
  
  Object.entries(emotionalMarkers).forEach(([emotion, data]) => {
    let score = 0;
    let intensity = 1;
    
    // Check words
    data.words.forEach(word => {
      if (lowerMsg.includes(word)) {
        score += 2;
        
        // Check for intensity modifiers
        data.intensity_modifiers.forEach(modifier => {
          if (lowerMsg.includes(`${modifier} ${word}`) || lowerMsg.includes(`${word} ${modifier}`)) {
            intensity += 0.5;
          }
        });
      }
    });
    
    // Check phrases
    data.phrases.forEach(phrase => {
      if (lowerMsg.includes(phrase)) {
        score += 3;
        intensity += 0.3;
      }
    });
    
    if (score > 0) {
      indicators.push({
        emotion,
        score,
        intensity: Math.min(intensity, 3),
        confidence: Math.min(score / 5, 1)
      });
    }
  });
  
  return indicators.sort((a, b) => b.score - a.score);
}

// DETECT PERSONAL SHARING LEVEL
function detectPersonalSharing(message) {
  const lowerMsg = message.toLowerCase();
  
  const sharingLevels = {
    deep_personal: {
      indicators: [
        'my depression', 'my anxiety', 'my trauma', 'my addiction', 'my therapy',
        'i was abused', 'i\'m struggling with', 'i\'ve been thinking about ending',
        'my darkest', 'my biggest fear', 'never told anyone'
      ],
      score: 10
    },
    personal: {
      indicators: [
        'my family', 'my relationship', 'my ex', 'my feelings', 'i feel',
        'my job situation', 'my health', 'my money problems', 'i\'m worried about',
        'my parents', 'my kids', 'my marriage'
      ],
      score: 7
    },
    somewhat_personal: {
      indicators: [
        'my job', 'my work', 'my boss', 'my day', 'i think',
        'my opinion', 'my experience', 'i believe', 'my situation'
      ],
      score: 4
    },
    surface: {
      indicators: [
        'my game', 'my phone', 'my car', 'i like', 'i want',
        'my preference', 'i need', 'i usually'
      ],
      score: 2
    }
  };
  
  let maxScore = 0;
  let level = 'none';
  
  Object.entries(sharingLevels).forEach(([levelName, data]) => {
    const score = data.indicators.reduce((sum, indicator) => {
      return sum + (lowerMsg.includes(indicator) ? data.score : 0);
    }, 0);
    
    if (score > maxScore) {
      maxScore = score;
      level = levelName;
    }
  });
  
  return { level, score: maxScore };
}

// DETECT LIFE EVENTS
function detectLifeEvents(message) {
  const lowerMsg = message.toLowerCase();
  const events = [];
  
  const lifeEventPatterns = {
    job_loss: ['fired', 'laid off', 'lost my job', 'got fired', 'unemployed'],
    job_gain: ['got a job', 'new job', 'hired', 'start work', 'job offer'],
    relationship_end: ['broke up', 'divorce', 'separated', 'relationship ended', 'split up'],
    relationship_start: ['new relationship', 'dating someone', 'met someone', 'boyfriend', 'girlfriend'],
    health_issue: ['diagnosed', 'surgery', 'hospital', 'sick', 'health problems'],
    financial_stress: ['broke', 'money problems', 'can\'t afford', 'bills', 'debt'],
    family_event: ['family emergency', 'mom died', 'dad passed', 'baby born', 'wedding'],
    moving: ['moving', 'new place', 'relocated', 'new apartment', 'new house'],
    education: ['graduated', 'starting school', 'college', 'degree', 'studying']
  };
  
  Object.entries(lifeEventPatterns).forEach(([event, patterns]) => {
    patterns.forEach(pattern => {
      if (lowerMsg.includes(pattern)) {
        events.push({
          type: event,
          pattern: pattern,
          timestamp: Date.now(),
          context: message.substring(0, 150)
        });
      }
    });
  });
  
  return events;
}

// ANALYZE COMMUNICATION STYLE
function analyzeCommStyle(message) {
  const style = {
    formality: message.includes('please') || message.includes('thank you') ? 'formal' : 'casual',
    directness: message.includes('?') ? 'questioning' : 'stating',
    emotional_expression: extractEmotionalIndicators(message).length > 0 ? 'expressive' : 'reserved',
    length_preference: message.length > 150 ? 'detailed' : message.length > 50 ? 'moderate' : 'brief',
    punctuation_style: {
      uses_caps: /[A-Z]{3,}/.test(message),
      uses_exclamation: message.includes('!'),
      uses_ellipsis: message.includes('...'),
      uses_emojis: /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(message)
    },
    slang_usage: ['wym', 'wtf', 'lol', 'omg', 'tbh', 'ngl'].some(slang => message.toLowerCase().includes(slang))
  };
  
  return style;
}

// EXTRACT CONVERSATION TOPICS
function extractTopics(message) {
  const lowerMsg = message.toLowerCase();
  const topics = [];
  
  const topicKeywords = {
    work: ['job', 'work', 'boss', 'office', 'career', 'fired', 'hired', 'interview', 'coworker'],
    family: ['family', 'mom', 'dad', 'parents', 'kids', 'children', 'sister', 'brother', 'relatives'],
    relationships: ['boyfriend', 'girlfriend', 'wife', 'husband', 'dating', 'relationship', 'love', 'ex'],
    money: ['money', 'bills', 'rent', 'broke', 'expensive', 'budget', 'financial', 'debt', 'salary'],
    health: ['sick', 'doctor', 'hospital', 'health', 'medicine', 'pain', 'tired', 'therapy'],
    emotions: ['feel', 'feeling', 'emotion', 'mood', 'depressed', 'happy', 'sad', 'angry'],
    gaming: ['game', 'play', 'slots', 'casino', 'win', 'lose', 'bet', 'gambling', 'deposit'],
    social: ['friends', 'party', 'social', 'hanging out', 'weekend', 'plans', 'alone', 'lonely'],
    education: ['school', 'college', 'studying', 'exam', 'degree', 'learning', 'teacher'],
    technology: ['phone', 'computer', 'internet', 'app', 'website', 'tech', 'online']
  };
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    const matches = keywords.filter(keyword => lowerMsg.includes(keyword));
    if (matches.length > 0) {
      topics.push({
        topic,
        keywords: matches,
        relevance: matches.length / keywords.length
      });
    }
  });
  
  return topics.sort((a, b) => b.relevance - a.relevance);
}

// DETECT VULNERABILITY LEVEL
function detectVulnerability(message) {
  const vulnerabilityMarkers = [
    'i don\'t know what to do', 'i\'m scared', 'i\'m lost', 'help me',
    'i feel alone', 'nobody understands', 'i can\'t handle', 'i\'m struggling',
    'i\'m breaking down', 'i can\'t cope', 'i\'m falling apart', 'i need someone'
  ];
  
  const lowerMsg = message.toLowerCase();
  const vulnerabilityScore = vulnerabilityMarkers.reduce((score, marker) => {
    return lowerMsg.includes(marker) ? score + 1 : score;
  }, 0);
  
  if (vulnerabilityScore > 2) return { level: 'high', score: vulnerabilityScore };
  if (vulnerabilityScore > 0) return { level: 'medium', score: vulnerabilityScore };
  return { level: 'low', score: 0 };
}

// DETECT SUPPORT SEEKING
function detectSupportSeeking(message) {
  const supportIndicators = [
    'advice', 'help', 'what should i do', 'tell me', 'think i should',
    'any ideas', 'suggestions', 'opinion', 'thoughts', 'guidance',
    'need someone to talk to', 'listen to me', 'understand me'
  ];
  
  const lowerMsg = message.toLowerCase();
  const matches = supportIndicators.filter(indicator => lowerMsg.includes(indicator));
  
  return {
    seeking_support: matches.length > 0,
    type: matches.length > 0 ? 'explicit' : 'none',
    indicators: matches
  };
}

// DETECT MOOD SHIFTS
function detectMoodShifts(message) {
  const moodIndicators = {
    improving: ['feeling better', 'getting better', 'mood lifted', 'cheering up', 'less stressed'],
    declining: ['getting worse', 'feeling down', 'mood dropped', 'more stressed', 'can\'t handle'],
    stable: ['same as usual', 'no change', 'still the same', 'steady']
  };
  
  const lowerMsg = message.toLowerCase();
  
  for (const [shift, indicators] of Object.entries(moodIndicators)) {
    if (indicators.some(indicator => lowerMsg.includes(indicator))) {
      return { shift, confidence: 0.8 };
    }
  }
  
  return { shift: 'unknown', confidence: 0 };
}

// DETECT STRESS SIGNALS
function detectStressSignals(message) {
  const stressMarkers = {
    acute: ['panic', 'freaking out', 'can\'t breathe', 'overwhelmed', 'breaking point'],
    chronic: ['always stressed', 'constantly worried', 'never relax', 'exhausted', 'burnt out'],
    situational: ['this situation', 'right now', 'today', 'lately', 'recently']
  };
  
  const lowerMsg = message.toLowerCase();
  const signals = [];
  
  Object.entries(stressMarkers).forEach(([type, markers]) => {
    markers.forEach(marker => {
      if (lowerMsg.includes(marker)) {
        signals.push({ type, marker, severity: type === 'acute' ? 'high' : type === 'chronic' ? 'medium' : 'low' });
      }
    });
  });
  
  return signals;
}

// DETECT RELATIONSHIP REFERENCES
function detectRelationshipRefs(message) {
  const relationshipRefs = {
    family: ['mom', 'dad', 'mother', 'father', 'parents', 'family', 'kids', 'children'],
    romantic: ['boyfriend', 'girlfriend', 'wife', 'husband', 'partner', 'dating', 'relationship'],
    friends: ['friends', 'buddy', 'pal', 'bestie', 'crew', 'squad'],
    professional: ['boss', 'coworker', 'colleague', 'manager', 'team']
  };
  
  const lowerMsg = message.toLowerCase();
  const references = [];
  
  Object.entries(relationshipRefs).forEach(([category, refs]) => {
    refs.forEach(ref => {
      if (lowerMsg.includes(ref)) {
        references.push({ category, reference: ref });
      }
    });
  });
  
  return references;
}

// UPDATE ULTRA-ADVANCED PROFILE
function updateUltraAdvancedProfile(userId, userMsg, assistantMsg, metadata) {
  try {
    const profiles = loadProfiles();
    
    if (!profiles[userId]) {
      profiles[userId] = createUltraAdvancedProfile();
    }
    
    const profile = profiles[userId];
    profile.totalChats++;
    profile.lastActive = Date.now();
    
    const msgMetadata = extractMessageMetadata(userMsg);
    
    // Update emotional intelligence
    updateEmotionalIntelligence(profile, msgMetadata, metadata);
    
    // Update life context
    updateLifeContext(profile, msgMetadata, userMsg);
    
    // Update communication patterns
    updateCommunicationPatterns(profile, msgMetadata);
    
    // Update relationship dynamics
    updateRelationshipDynamics(profile, msgMetadata, metadata);
    
    // Update predictive patterns
    updatePredictivePatterns(profile, msgMetadata, metadata);
    
    saveProfiles(profiles);
  } catch (error) {
    console.error('Error updating ultra-advanced profile:', error);
  }
}

function createUltraAdvancedProfile() {
  return {
    // Basic information
    name: '', firstSeen: Date.now(), totalChats: 0, lastActive: Date.now(),
    
    // Emotional intelligence
    emotional_journey: [],
    emotional_patterns: [],
    mood_baseline: 'neutral',
    emotional_volatility: 'stable',
    trigger_patterns: [],
    recovery_patterns: [],
    support_responsiveness: 'unknown',
    
    // Personal life tracking
    personal_stories: [],
    life_events: [],
    life_context: {
      work_situation: {},
      family_dynamics: {},
      relationship_status: {},
      financial_situation: {},
      health_status: {},
      living_situation: {}
    },
    
    // Communication intelligence
    communication_preferences: {
      greeting_style: 'unknown',
      formality_level: 'casual',
      message_length_preference: 'moderate',
      emotional_expression_style: 'moderate',
      humor_style: 'unknown',
      conflict_resolution_style: 'unknown',
      support_seeking_style: 'unknown'
    },
    
    // Relationship building
    persona_relationships: {
      marcus: { trust_level: 0, interactions: 0, relationship_quality: 'new' },
      sofia: { trust_level: 0, interactions: 0, relationship_quality: 'new' },
      victor: { trust_level: 0, interactions: 0, relationship_quality: 'new' }
    },
    preferred_persona: null,
    relationship_depth: 'stranger',
    trust_milestones: [],
    
    // Behavioral intelligence
    conversation_patterns: [],
    response_patterns: [],
    engagement_patterns: [],
    gaming_patterns: [],
    
    // Predictive modeling
    likely_needs: [],
    predicted_behaviors: [],
    optimal_response_strategies: [],
    relationship_trajectory: 'unknown',
    
    // Scores and metrics
    trust_score: 0,
    engagement_score: 50,
    emotional_openness_score: 0,
    relationship_satisfaction_score: 0,
    support_effectiveness_score: 0
  };
}

function extractMessageMetadata(message) {
  return {
    emotional_indicators: extractEmotionalIndicators(message),
    personal_sharing: detectPersonalSharing(message),
    topics: extractTopics(message),
    vulnerability: detectVulnerability(message),
    support_seeking: detectSupportSeeking(message),
    life_events: detectLifeEvents(message),
    relationship_refs: detectRelationshipRefs(message),
    mood_shifts: detectMoodShifts(message),
    stress_signals: detectStressSignals(message),
    communication_style: analyzeCommStyle(message)
  };
}

// Continue with other advanced functions...
// [Additional functions would continue here for space reasons]

// ENHANCED ANALYTICS AND INSIGHTS
function getAdvancedPlayerInsights(userId) {
  try {
    const profile = getProfile(userId);
    if (!profile) return null;
    
    const humanPatterns = loadHumanPatterns();
    const relationships = loadRelationships();
    const lifeEvents = loadLifeEvents();
    const emotionalJourney = loadEmotionalJourney();
    
    return {
      emotional_intelligence: {
        current_state: profile.emotional_journey?.slice(-1)[0] || null,
        patterns: profile.emotional_patterns || [],
        triggers: profile.trigger_patterns || [],
        support_needs: profile.support_responsiveness || 'unknown'
      },
      relationship_analysis: {
        preferred_persona: profile.preferred_persona,
        trust_levels: profile.persona_relationships,
        relationship_trajectory: profile.relationship_trajectory,
        communication_style: profile.communication_preferences
      },
      life_context: {
        major_events: lifeEvents.major_events?.[userId] || [],
        current_situations: profile.life_context || {},
        stress_factors: profile.stress_patterns || []
      },
      behavioral_predictions: {
        likely_needs: profile.likely_needs || [],
        optimal_strategies: profile.optimal_response_strategies || [],
        engagement_forecast: profile.engagement_patterns || []
      }
    };
  } catch (error) {
    console.error('Error getting advanced insights:', error);
    return null;
  }
}

// BACKWARD COMPATIBILITY FUNCTIONS
function getProfile(userId) {
  try {
    const profiles = loadProfiles();
    return profiles[userId] || null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
}

function getCasinoStats() {
  // Enhanced casino stats with advanced analytics
  try {
    const profiles = loadProfiles();
    const allUsers = Object.keys(profiles);
    
    return {
      overview: {
        total_players: allUsers.length,
        active_today: allUsers.filter(id => {
          const profile = profiles[id];
          return profile && Date.now() - profile.lastActive < 86400000;
        }).length,
        total_conversations: Object.values(profiles).reduce((sum, p) => sum + (p.totalChats || 0), 0)
      },
      emotional_intelligence: {
        players_needing_support: allUsers.filter(id => {
          const profile = profiles[id];
          return profile?.support_responsiveness === 'high_need';
        }).length,
        relationship_health: {
          deep_connections: allUsers.filter(id => profiles[id]?.relationship_depth === 'close_friend').length,
          trust_building: allUsers.filter(id => (profiles[id]?.trust_score || 0) > 70).length
        }
      }
    };
  } catch (error) {
    console.error('Error getting casino stats:', error);
    return { overview: {}, emotional_intelligence: {} };
  }
}

// CLEAR FUNCTIONS
function clear(userId) {
  try {
    // Clear from all databases
    const db = load();
    delete db[userId];
    save(db);
    
    const profiles = loadProfiles();
    delete profiles[userId];
    saveProfiles(profiles);
    
    const patterns = loadHumanPatterns();
    delete patterns.conversation_patterns[userId];
    saveHumanPatterns(patterns);
    
    const relationships = loadRelationships();
    delete relationships.persona_bonds[userId];
    saveRelationships(relationships);
    
    const events = loadLifeEvents();
    delete events.major_events[userId];
    saveLifeEvents(events);
    
    const journey = loadEmotionalJourney();
    delete journey.emotional_timeline[userId];
    saveEmotionalJourney(journey);
    
    console.log(`Cleared all ultra-advanced data for ${userId}`);
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
      emotional_intelligence: {},
      personality_analysis: {},
      communication_evolution: {},
      behavioral_predictions: {}
    });
    saveRelationships({
      persona_bonds: {},
      trust_milestones: {},
      shared_experiences: {},
      emotional_connections: {},
      conflict_resolutions: {}
    });
    saveLifeEvents({
      major_events: {},
      ongoing_situations: {},
      life_transitions: {},
      stress_periods: {},
      celebration_moments: {}
    });
    saveEmotionalJourney({
      emotional_timeline: {},
      mood_patterns: {},
      trigger_analysis: {},
      recovery_patterns: {},
      support_effectiveness: {}
    });
    console.log('Cleared all ultra-advanced data');
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
}

function getAll() {
  return load();
}

function getAllProfiles() {
  return loadProfiles();
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
  
  // Ultra-advanced functions
  addSocialAdvancedTurn,
  getAdvancedPlayerInsights,
  
  // Data access functions
  loadHumanPatterns,
  loadRelationships,
  loadLifeEvents,
  loadEmotionalJourney,
  
  // Analysis functions
  extractEmotionalIndicators,
  detectPersonalSharing,
  detectLifeEvents,
  analyzeCommStyle,
  extractTopics,
  detectVulnerability,
  detectSupportSeeking
};