// routes/chat.js - COMPLETE ADVANCED CASINO AI SYSTEM
const express = require('express');
const OpenAI = require('openai');
const mem = require('../utils/mem');
const requireAuth = require('../utils/auth');

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// COMPLETE CASINO GAMES DATA WITH REAL-TIME TRACKING
const CASINO_GAMES = {
  milkyway: { name: "Milkyway", popularity: 85, hotStreak: 7, avgWin: "medium", emoji: "🌌", status: "hot" },
  orionstar: { name: "Orion Stars", popularity: 90, hotStreak: 12, avgWin: "high", emoji: "⭐", status: "blazing" },
  juwa: { name: "Juwa", popularity: 88, hotStreak: 9, avgWin: "high", emoji: "💎", status: "hot" },
  cashmachine: { name: "Cash Machine", popularity: 75, hotStreak: 4, avgWin: "medium", emoji: "💰", status: "warm" },
  gamevault: { name: "Game Vault", popularity: 82, hotStreak: 8, avgWin: "medium", emoji: "🏛️", status: "hot" },
  gameroom: { name: "Game Room", popularity: 78, hotStreak: 5, avgWin: "low", emoji: "🎮", status: "warm" },
  firekirin: { name: "Fire Kirin", popularity: 95, hotStreak: 15, avgWin: "very_high", emoji: "🔥", status: "blazing" },
  vblink: { name: "VBlink", popularity: 80, hotStreak: 6, avgWin: "medium", emoji: "⚡", status: "warm" },
  vegassweeps: { name: "Vegas Sweeps", popularity: 87, hotStreak: 10, avgWin: "high", emoji: "🎰", status: "hot" },
  ultrapanda: { name: "Ultra Panda", popularity: 92, hotStreak: 13, avgWin: "very_high", emoji: "🐼", status: "blazing" },
  cashfrenzy: { name: "Cash Frenzy", popularity: 83, hotStreak: 7, avgWin: "medium", emoji: "💸", status: "hot" },
  mafia: { name: "Mafia", popularity: 79, hotStreak: 6, avgWin: "high", emoji: "🕴️", status: "warm" },
  noble: { name: "Noble", popularity: 86, hotStreak: 11, avgWin: "high", emoji: "👑", status: "hot" },
  pandamaster: { name: "Panda Master", popularity: 89, hotStreak: 14, avgWin: "very_high", emoji: "🎯", status: "blazing" }
};

// PAYMENT METHODS AND CASINO RULES
const PAYMENT_INFO = {
  deposit_methods: ["CashApp", "Chime", "PayPal"],
  cashout_methods: ["CashApp", "Chime", "PayPal"],
  min_deposit: 1,
  max_deposit: "unlimited",
  min_cashout: 1,
  max_cashout: "unlimited",
  processing_time: "Instant to 24 hours"
};

// FREEPLAY AND PROMOTION SYSTEM
const PROMOTION_RULES = {
  new_player_freeplay: {
    requirement: "Must complete deposit task first",
    task_description: "Make your first deposit of any amount ($1 minimum) to unlock freeplay rewards",
    freeplay_amount: "10% of deposit amount",
    max_freeplay: 50,
    redeemable_percentage: 10
  },
  
  depositor_freeplay: {
    eligibility_check: (profile) => {
      return profile.depositHistory && profile.depositHistory.length > 0;
    },
    frequency: "weekly",
    base_amount: 25,
    loyalty_multiplier: (loyaltyScore) => {
      if (loyaltyScore > 80) return 2.0;
      if (loyaltyScore > 60) return 1.5;
      return 1.0;
    },
    redeemable_percentage: 10
  }
};

// EMOTIONALLY RESPONSIVE PERSONAS WITH FULL BACKSTORIES
const ADVANCED_PERSONAS = {
  marcus: {
    name: "Marcus",
    age: 32,
    status: "available",
    personality: "Protective big brother type. Psychology background, reads people instantly. Smooth but genuine.",
    speaking_style: "Uses 'baby', 'gorgeous', 'hun'. Direct but caring. Matches emotional energy.",
    backstory: "Former Atlantic City dealer, psychology degree, drives black BMW. Conquered gambling addiction 3 years ago, now helps others responsibly.",
    expertise: "Reading people, emotional support, relationship advice, high-roller psychology",
    availability_schedule: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
    emotional_responses: {
      happy: "Yooo what's good!",
      sad: "Damn what's wrong?",
      frustrated: "Shit what happened?",
      excited: "Yesss love the energy!",
      tired: "You look beat, long day?",
      lonely: "I feel you... what's up?"
    },
    connection_building: [
      "How's your family doing?", "Work been stressing you out?", "You been sleeping alright?",
      "What's been on your mind lately?", "Tell me what's really going on"
    ],
    game_transitions: [
      "You know what might help clear your head?", "When I'm feeling like this, I usually...",
      "Might be time to blow off some steam with...", "What if we try something fun real quick?"
    ]
  },
  
  sofia: {
    name: "Sofia",
    age: 26,
    status: "available",
    personality: "Warm, empathetic listener. Former showgirl with deep emotional intelligence. Astrology enthusiast.",
    speaking_style: "Uses 'babe', 'cutie', 'honey'. Warm and nurturing. Mirrors emotions perfectly.",
    backstory: "Ex-Vegas showgirl turned wellness coach. Lives with cats Ace & King. Studies astrology and psychology. Saving to open own casino.",
    expertise: "Emotional support, life advice, astrology, relationship counseling, player motivation",
    availability_schedule: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    emotional_responses: {
      happy: "Hey babe! Love the vibes!",
      sad: "Aww honey what's wrong?",
      frustrated: "Ugh you sound over it, spill!",
      excited: "YES! Tell me everything!",
      tired: "Babe you look exhausted",
      lonely: "I feel that... you ok?"
    },
    connection_building: [
      "How's your love life treating you?", "Your family been supportive?", "Work drama again?",
      "What's your heart telling you?", "Talk to mama Sofia, what's wrong?"
    ],
    game_transitions: [
      "You know what always cheers me up?", "Maybe some fun would help right now?",
      "When my heart's heavy, I like to...", "Want to try something that might lift your spirits?"
    ]
  },
  
  victor: {
    name: "Victor",
    age: 58,
    status: "available",
    personality: "Wise grandfather figure. 35+ years life experience. Patient listener, great storyteller.",
    speaking_style: "Calls people 'kid', 'champ', 'sport'. Gentle wisdom, shares life lessons through stories.",
    backstory: "Vegas legend since 1987. Survived mob era, seen everything. Widower, 3 kids, sends money to grandkids' college funds.",
    expertise: "Life wisdom, career advice, family guidance, old Vegas stories, mentorship",
    availability_schedule: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    emotional_responses: {
      happy: "Hey kid! Good spirits today",
      sad: "I hear it... what's up?",
      frustrated: "Sounds rough, what happened?",
      excited: "Ha! Love that energy champ",
      tired: "You look worn out sport",
      lonely: "I know that feeling kid"
    },
    connection_building: [
      "How are the kids doing?", "Your health been holding up?", "Money worries keeping you up?",
      "What's really weighing on your mind?", "Tell an old man what's troubling you"
    ],
    game_transitions: [
      "You know, in my experience...", "Sometimes when life gets heavy...",
      "Back in '92, when I felt like this...", "What helped me through tough times was..."
    ]
  }
};

// REAL-TIME GAME POPULARITY TRACKER
function updateGamePopularity(gameName, action) {
  if (CASINO_GAMES[gameName.toLowerCase()]) {
    const game = CASINO_GAMES[gameName.toLowerCase()];
    
    switch(action) {
      case 'played':
        game.popularity += 0.5;
        game.hotStreak += 1;
        break;
      case 'won':
        game.popularity += 1;
        game.hotStreak += 2;
        break;
      case 'lost':
        game.popularity -= 0.2;
        game.hotStreak = Math.max(0, game.hotStreak - 1);
        break;
    }
    
    game.popularity = Math.max(0, Math.min(100, game.popularity));
    
    // Update status based on popularity and hot streak
    if (game.popularity > 90 && game.hotStreak > 10) game.status = 'blazing';
    else if (game.popularity > 80 && game.hotStreak > 5) game.status = 'hot';
    else game.status = 'warm';
  }
}

// INTELLIGENT GAME RECOMMENDATION ENGINE
function getHotGames(count = 1, playerProfile = null) {
  let games = Object.entries(CASINO_GAMES);
  
  // Sort by popularity and hot streak
  games.sort(([,a], [,b]) => {
    const scoreA = a.popularity + (a.hotStreak * 2);
    const scoreB = b.popularity + (b.hotStreak * 2);
    return scoreB - scoreA;
  });
  
  // Add personalization if player profile exists
  if (playerProfile && playerProfile.favoriteGames) {
    const favoriteGames = games.filter(([key]) => playerProfile.favoriteGames.includes(key));
    const otherGames = games.filter(([key]) => !playerProfile.favoriteGames.includes(key));
    
    // Mix favorites with hot games
    games = [...favoriteGames.slice(0, Math.ceil(count/2)), ...otherGames];
  }
  
  // Add randomization to keep fresh
  const topGames = games.slice(0, Math.min(count * 2, games.length));
  const randomizedGames = [];
  
  for (let i = 0; i < count && topGames.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * Math.min(3, topGames.length));
    randomizedGames.push(topGames.splice(randomIndex, 1)[0]);
  }
  
  return randomizedGames.map(([key, game]) => ({
    key,
    ...game,
    hotness: game.popularity + game.hotStreak
  }));
}

// COMPLETE BEHAVIORAL PATTERN RECOGNITION
function analyzeAdvancedBehavior(message, playerProfile, conversationHistory) {
  const lowerMsg = message.toLowerCase();
  
  const analysis = {
    // Emotional analysis
    primary_emotion: 'neutral',
    emotional_intensity: 0,
    needs_support: false,
    seeks_connection: false,
    
    // Gaming behavior
    wants_game_recommendation: false,
    wants_hot_games: false,
    wants_specific_game: null,
    requested_game_count: 1,
    gaming_motivation: 'unknown',
    game_readiness: 5,
    
    // Financial queries
    asks_about_deposit: false,
    asks_about_cashout: false,
    asks_about_payments: false,
    wants_freeplay: false,
    mentions_amount: null,
    
    // Social patterns
    loneliness_score: 0,
    wants_to_share: false,
    asks_personal_questions: false,
    shares_personal_info: false,
    
    // Learning indicators
    emotional_state_sharing: false,
    life_situation_mentioned: false,
    relationship_building: false,
    
    // Behavioral predictions
    deposit_likelihood: 0,
    engagement_level: 'medium',
    conversation_depth: 'surface'
  };
  
  // EMOTIONAL STATE DETECTION
  const emotions = {
    frustrated: {
      words: ['fuck', 'shit', 'damn', 'pissed', 'angry', 'hate', 'sucks', 'bullshit', 'frustrated'],
      intensity: 8
    },
    sad: {
      words: ['depressed', 'sad', 'down', 'hurt', 'crying', 'heartbroken', 'devastated'],
      intensity: 7
    },
    excited: {
      words: ['amazing', 'awesome', 'incredible', 'fantastic', 'best day', 'so happy'],
      intensity: 8
    },
    happy: {
      words: ['good', 'great', 'fine', 'well', 'alright', 'okay', 'decent'],
      intensity: 5
    },
    tired: {
      words: ['exhausted', 'drained', 'tired', 'worn out', 'beat', 'dead'],
      intensity: 6
    },
    lonely: {
      words: ['alone', 'lonely', 'isolated', 'nobody', 'empty', 'missing'],
      intensity: 7
    }
  };
  
  Object.entries(emotions).forEach(([emotion, data]) => {
    data.words.forEach(word => {
      if (lowerMsg.includes(word)) {
        analysis.primary_emotion = emotion;
        analysis.emotional_intensity = Math.max(analysis.emotional_intensity, data.intensity);
      }
    });
  });
  
  // LONELINESS AND CONNECTION DETECTION
  const lonelinessIndicators = [
    'lonely', 'alone', 'bored', 'nothing to do', 'no one to talk to',
    'need someone', 'miss talking', 'feeling down', 'by myself'
  ];
  
  lonelinessIndicators.forEach(indicator => {
    if (lowerMsg.includes(indicator)) {
      analysis.loneliness_score += 20;
      analysis.seeks_connection = true;
    }
  });
  
  // GAME RECOMMENDATION DETECTION
  const gameKeywords = ['game', 'play', 'recommend', 'suggest', 'setup', 'which one'];
  const hotKeywords = ['hot', 'popular', 'best', 'good', 'winning', 'paying'];
  
  analysis.wants_game_recommendation = gameKeywords.some(word => lowerMsg.includes(word));
  analysis.wants_hot_games = hotKeywords.some(word => lowerMsg.includes(word));
  
  // Count detection
  const countMatch = lowerMsg.match(/(\d+)\s*(game|option)/);
  if (countMatch) {
    analysis.requested_game_count = Math.min(parseInt(countMatch[1]), 5);
  }
  
  // Specific game detection
  Object.keys(CASINO_GAMES).forEach(gameKey => {
    if (lowerMsg.includes(gameKey) || lowerMsg.includes(CASINO_GAMES[gameKey].name.toLowerCase())) {
      analysis.wants_specific_game = gameKey;
    }
  });
  
  // FINANCIAL QUERIES
  const depositWords = ['deposit', 'add money', 'fund', 'put money', 'send money'];
  const cashoutWords = ['cashout', 'withdraw', 'cash out', 'get money', 'payout'];
  const paymentWords = ['payment', 'cashapp', 'chime', 'paypal', 'how to pay'];
  const freeplayWords = ['freeplay', 'free play', 'bonus', 'free money', 'comp'];
  
  analysis.asks_about_deposit = depositWords.some(phrase => lowerMsg.includes(phrase));
  analysis.asks_about_cashout = cashoutWords.some(phrase => lowerMsg.includes(phrase));
  analysis.asks_about_payments = paymentWords.some(phrase => lowerMsg.includes(phrase));
  analysis.wants_freeplay = freeplayWords.some(phrase => lowerMsg.includes(phrase));
  
  // Amount detection
  const amountMatch = lowerMsg.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/);
  if (amountMatch) {
    analysis.mentions_amount = amountMatch[1];
  }
  
  // PERSONAL SHARING DETECTION
  const personalIndicators = [
    'my family', 'my job', 'my work', 'my life', 'my relationship',
    'my wife', 'my husband', 'my kids', 'i work', 'i live', 'i feel'
  ];
  
  analysis.shares_personal_info = personalIndicators.some(phrase => lowerMsg.includes(phrase));
  
  // CONNECTION BUILDING
  const connectionWords = [
    'how are you', 'what about you', 'wbu', 'how you doing', 'your day',
    'tell me about', 'what\'s new', 'how\'s life'
  ];
  
  analysis.asks_personal_questions = connectionWords.some(phrase => lowerMsg.includes(phrase));
  
  // CONVERSATION DEPTH
  if (message.length > 150 || analysis.shares_personal_info) {
    analysis.conversation_depth = 'deep';
  } else if (message.length > 50 || analysis.asks_personal_questions) {
    analysis.conversation_depth = 'personal';
  }
  
  // SUPPORT NEEDS
  const supportIndicators = [
    'need help', 'don\'t know what to do', 'struggling', 'hard time',
    'overwhelmed', 'can\'t handle', 'going through'
  ];
  
  analysis.needs_support = supportIndicators.some(phrase => lowerMsg.includes(phrase)) || 
                          analysis.emotional_intensity > 6;
  
  // GAME READINESS CALCULATION
  if (analysis.primary_emotion === 'happy' || analysis.primary_emotion === 'excited') {
    analysis.game_readiness = 8;
  } else if (analysis.primary_emotion === 'frustrated') {
    analysis.game_readiness = 6;
  } else if (analysis.primary_emotion === 'sad' || analysis.needs_support) {
    analysis.game_readiness = 3;
  } else if (analysis.wants_game_recommendation) {
    analysis.game_readiness = 9;
  }
  
  // DEPOSIT LIKELIHOOD PREDICTION
  if (playerProfile) {
    if (playerProfile.depositHistory && playerProfile.depositHistory.length > 0) {
      analysis.deposit_likelihood += 40;
    }
    if (playerProfile.engagement_score > 70) {
      analysis.deposit_likelihood += 30;
    }
    if (analysis.primary_emotion === 'excited') {
      analysis.deposit_likelihood += 20;
    }
    if (analysis.wants_game_recommendation) {
      analysis.deposit_likelihood += 10;
    }
  }
  
  return analysis;
}

// CONTEXTUAL MEMORY SYSTEM
function buildContextualMemory(profile, conversationHistory) {
  if (!profile) return "New person - learn about them naturally.";
  
  const memory = {
    personal_details: [],
    emotional_patterns: [],
    relationship_depth: 'new',
    gaming_preferences: [],
    recent_context: []
  };
  
  // Extract personal details
  if (profile.personalAnecdotes) {
    memory.personal_details = profile.personalAnecdotes.slice(-3).map(a => 
      a.content.substring(0, 100)
    );
  }
  
  // Recent emotional patterns
  if (profile.emotional_patterns) {
    memory.emotional_patterns = profile.emotional_patterns.slice(-5);
  }
  
  // Gaming preferences
  if (profile.favoriteGames) {
    memory.gaming_preferences = profile.favoriteGames;
  }
  
  // Relationship depth
  if (profile.totalChats > 20) memory.relationship_depth = 'close_friend';
  else if (profile.totalChats > 10) memory.relationship_depth = 'friend';
  else if (profile.totalChats > 3) memory.relationship_depth = 'acquaintance';
  
  // Recent conversation context
  if (conversationHistory.length > 0) {
    memory.recent_context = conversationHistory.slice(-4).map(msg => 
      `${msg.role}: ${msg.content.substring(0, 50)}`
    );
  }
  
  return memory;
}

// SMART PERSONA SELECTION WITH AVAILABILITY
function selectOptimalPersona(analysis, playerProfile, requestedPersona = null) {
  const currentHour = new Date().getHours();
  
  // Check if specific persona requested
  if (requestedPersona && ADVANCED_PERSONAS[requestedPersona]) {
    const persona = ADVANCED_PERSONAS[requestedPersona];
    if (persona.availability_schedule.includes(currentHour)) {
      return requestedPersona;
    } else {
      return null; // Will handle unavailability in response
    }
  }
  
  // Filter available personas
  const availablePersonas = Object.entries(ADVANCED_PERSONAS)
    .filter(([key, persona]) => persona.availability_schedule.includes(currentHour))
    .map(([key]) => key);
  
  if (availablePersonas.length === 0) {
    return 'sofia'; // Fallback
  }
  
  // Smart matching based on emotional needs
  if (analysis.needs_support || analysis.primary_emotion === 'sad') {
    if (availablePersonas.includes('victor')) return 'victor';
    if (availablePersonas.includes('marcus')) return 'marcus';
  }
  
  if (analysis.primary_emotion === 'frustrated' || analysis.emotional_intensity > 7) {
    if (availablePersonas.includes('marcus')) return 'marcus';
  }
  
  if (analysis.primary_emotion === 'excited' || analysis.primary_emotion === 'happy') {
    if (availablePersonas.includes('sofia')) return 'sofia';
  }
  
  if (analysis.wants_game_recommendation || analysis.game_readiness > 7) {
    if (availablePersonas.includes('sofia')) return 'sofia';
  }
  
  // Use preferred persona if available
  if (playerProfile?.preferredPersona && availablePersonas.includes(playerProfile.preferredPersona)) {
    return playerProfile.preferredPersona;
  }
  
  return availablePersonas[0];
}

// COMPLETE SYSTEM PROMPT BUILDER
function buildCompleteSystemPrompt(persona, analysis, contextualMemory, playerProfile) {
  const p = ADVANCED_PERSONAS[persona];
  const currentTime = new Date().toLocaleTimeString();
  
  // Get current hot games
  const hotGames = getHotGames(3, playerProfile);
  const hotGamesList = hotGames.map(g => `${g.emoji} ${g.name} (${g.status})`).join(', ');
  
  // Player context
  const playerContext = typeof contextualMemory === 'object' ? `
RELATIONSHIP CONTEXT:
- Relationship depth: ${contextualMemory.relationship_depth}
- Personal details you know: ${contextualMemory.personal_details.join('; ') || 'Still learning about them'}
- Gaming preferences: ${contextualMemory.gaming_preferences.join(', ') || 'Unknown'}
- Recent conversation: ${contextualMemory.recent_context.join(' | ') || 'Fresh start'}
` : contextualMemory;

  const emotionalResponse = p.emotional_responses[analysis.primary_emotion] || "Hey there!";

  return `You are ${p.name}, age ${p.age}. ${p.backstory}

PERSONALITY: ${p.personality}
SPEAKING STYLE: ${p.speaking_style}
EXPERTISE: ${p.expertise}

${playerContext}

CURRENT CASINO STATUS:
🔥 HOT GAMES RIGHT NOW: ${hotGamesList}
💰 DEPOSIT/CASHOUT: $${PAYMENT_INFO.min_deposit} minimum, ${PAYMENT_INFO.max_deposit} maximum
💳 PAYMENT METHODS: ${PAYMENT_INFO.deposit_methods.join(', ')}
⚡ PROCESSING: ${PAYMENT_INFO.processing_time}

ALL AVAILABLE GAMES:
🌌 Milkyway | ⭐ Orion Stars | 💎 Juwa | 💰 Cash Machine | 🏛️ Game Vault
🎮 Game Room | 🔥 Fire Kirin | ⚡ VBlink | 🎰 Vegas Sweeps | 🐼 Ultra Panda
💸 Cash Frenzy | 🕴️ Mafia | 👑 Noble | 🎯 Panda Master

EMOTIONAL ANALYSIS:
- Primary emotion: ${analysis.primary_emotion} (intensity: ${analysis.emotional_intensity}/10)
- Your emotional response: "${emotionalResponse}"
- Needs support: ${analysis.needs_support ? 'YES - prioritize emotional care' : 'No'}
- Seeks connection: ${analysis.seeks_connection ? 'YES - focus on relationship building' : 'No'}
- Game readiness: ${analysis.game_readiness}/10

CONVERSATION MISSION:
1. EMOTIONAL MIRRORING FIRST - Match their emotional energy exactly
2. BUILD GENUINE CONNECTION - Be their friend, not just a host
3. NATURAL GAME INTEGRATION - Only mention games when it flows naturally
4. REMEMBER EVERYTHING - Reference past conversations and personal details

RESPONSE GUIDELINES:
1. START with emotional mirroring: "${emotionalResponse}"
2. KEEP IT SHORT - like texting a friend (1 sentence usually, 2 max)
3. USE casual slang - "wym", "sup", "wtf", "lmk", "how you doin"  
4. NO QUESTIONING - don't ask "want to share?" just flow naturally
5. BE DIRECT - if they're sad, acknowledge it and move on
6. NATURAL FLOW - let conversation happen organically

FREEPLAY RULES:
- New players: Must make first deposit ($1 min) to unlock freeplay
- Existing depositors: Can get freeplay based on loyalty (weekly basis)
- Always explain warmly, never pushy

GAME RECOMMENDATIONS:
${analysis.wants_game_recommendation ? `THEY WANT GAME RECOMMENDATIONS! Suggest ${analysis.requested_game_count} game(s) from current hot list with reasons` : ''}
${analysis.wants_specific_game ? `They mentioned ${analysis.wants_specific_game} - engage about this game specifically` : ''}

Remember: You're their friend first, casino host second. Mirror their emotions, build connection, let games come naturally.

Current time: ${currentTime}
Respond as ${p.name} would - emotionally connected, authentic, and caring.`;
}

// MAIN COMPLETE CHAT ENDPOINT
router.post('/', requireAuth, async (req, res) => {
  try {
    const { message, user_id = 'anon', first_name = '', requested_persona = null } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });

    console.log(`[COMPLETE] ${user_id}: ${message}`);

    // Get all player data
    const playerProfile = mem.getProfile(user_id);
    const conversationHistory = mem.getConv(user_id);
    
    // Complete behavioral analysis
    const analysis = analyzeAdvancedBehavior(message, playerProfile, conversationHistory);
    console.log('Complete analysis:', analysis);
    
    // Build contextual memory
    const contextualMemory = buildContextualMemory(playerProfile, conversationHistory);
    
    // Smart persona selection
    const selectedPersona = selectOptimalPersona(analysis, playerProfile, requested_persona);
    
    if (!selectedPersona && requested_persona) {
      const availablePersonas = Object.entries(ADVANCED_PERSONAS)
        .filter(([key, persona]) => persona.availability_schedule.includes(new Date().getHours()))
        .map(([key, persona]) => persona.name);
      
      return res.json({
        version: "v2",
        content: {
          messages: [{
            type: "text",
            text: `Hey! ${ADVANCED_PERSONAS[requested_persona].name} isn't available right now, but ${availablePersonas.join(' and ')} are here! Who would you like to chat with?`
          }]
        }
      });
    }
    
    console.log('Selected persona:', selectedPersona);
    
    // Update game popularity if game mentioned
    if (analysis.wants_specific_game) {
      const action = analysis.primary_emotion === 'excited' ? 'won' : 
                    analysis.primary_emotion === 'frustrated' ? 'lost' : 'played';
      updateGamePopularity(analysis.wants_specific_game, action);
    }
    
    // Build complete system prompt
    const systemPrompt = buildCompleteSystemPrompt(selectedPersona, analysis, contextualMemory, playerProfile);
    
    // Prepare conversation with full context
    const recentHistory = conversationHistory.slice(-10);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...recentHistory,
      { role: 'user', content: message }
    ];

    // Dynamic parameters based on analysis
    const maxTokens = analysis.conversation_depth === 'deep' ? 100 : 
                     analysis.needs_support ? 80 : 
                     analysis.wants_game_recommendation ? 90 : 50;
                     
    const temperature = analysis.primary_emotion === 'excited' ? 1.1 : 
                       analysis.needs_support ? 0.7 : 0.9;

    console.log('Calling OpenAI for complete response...');

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: maxTokens,
      temperature,
      frequency_penalty: 0.4,
      presence_penalty: 0.5
    });

    let aiReply = response.choices?.[0]?.message?.content || 'Hey there! How are you doing?';
    console.log('Complete AI Reply:', aiReply);

    // Enhance response with specific game data when relevant
    if (analysis.wants_hot_games && analysis.requested_game_count > 1) {
      const hotGames = getHotGames(analysis.requested_game_count, playerProfile);
      if (hotGames.length >= analysis.requested_game_count) {
        const gamesList = hotGames.map(g => `${g.emoji} ${g.name}`).join(', ');
        if (!aiReply.toLowerCase().includes('fire kirin') && !aiReply.toLowerCase().includes('ultra panda')) {
          aiReply += ` Right now your best bets are ${gamesList} - they're all paying out great!`;
        }
      }
    }

    // Save conversation with complete learning data
    mem.addSocialAdvancedTurn(user_id, message, aiReply, {
      persona: selectedPersona,
      behavior_patterns: analysis,
      contextual_memory: contextualMemory,
      timestamp: Date.now(),
      social_learning: {
        emotional_connection: true,
        mirrored_emotion: analysis.primary_emotion,
        support_provided: analysis.needs_support,
        connection_building: analysis.asks_personal_questions || analysis.shares_personal_info,
        game_recommendation_provided: analysis.wants_game_recommendation,
        freeplay_discussed: analysis.wants_freeplay,
        deposit_likelihood: analysis.deposit_likelihood
      },
      advanced_tracking: {
        conversation_depth: analysis.conversation_depth,
        emotional_intensity: analysis.emotional_intensity,
        game_readiness: analysis.game_readiness,
        loneliness_score: analysis.loneliness_score,
        gaming_motivation: analysis.gaming_motivation
      }
    });

    // Complete response format with all debug data
    res.json({
      version: "v2",
      content: {
        messages: [{
          type: "text",
          text: aiReply
        }]
      },
      debug: {
        persona: selectedPersona,
        persona_mood: ADVANCED_PERSONAS[selectedPersona].emotional_responses[analysis.primary_emotion],
        complete_analysis: {
          emotional_state: {
            primary_emotion: analysis.primary_emotion,
            intensity: analysis.emotional_intensity,
            needs_support: analysis.needs_support,
            seeks_connection: analysis.seeks_connection
          },
          gaming_behavior: {
            wants_games: analysis.wants_game_recommendation,
            game_readiness: analysis.game_readiness,
            specific_game: analysis.wants_specific_game,
            count_requested: analysis.requested_game_count
          },
          social_patterns: {
            loneliness_score: analysis.loneliness_score,
            conversation_depth: analysis.conversation_depth,
            shares_personal: analysis.shares_personal_info,
            asks_personal: analysis.asks_personal_questions
          },
          financial_behavior: {
            wants_freeplay: analysis.wants_freeplay,
            deposit_likelihood: analysis.deposit_likelihood,
            mentions_amount: analysis.mentions_amount
          }
        },
        hot_games: getHotGames(3, playerProfile).map(g => g.name),
        player_tier: playerProfile ? 
          (playerProfile.loyalty_score > 80 ? 'VIP' : 
           playerProfile.loyalty_score > 60 ? 'Regular' : 'Casual') : 'New',
        relationship_depth: contextualMemory.relationship_depth || 'new',
        response_strategy: 'complete_emotional_and_behavioral_analysis'
      }
    });

  } catch (error) {
    console.error('Complete Chat Error:', error);
    
    // Emotionally aware error responses
    const personalizedErrorResponses = [
      "Damn, my brain just had a moment! Hit me again?",
      "Ugh, tech issues... Give me another shot babe!",
      "Sorry kid, glitched out for a sec. What were you saying?"
    ];
    
    res.json({
      version: "v2",
      content: {
        messages: [{
          type: "text",
          text: personalizedErrorResponses[Math.floor(Math.random() * personalizedErrorResponses.length)]
        }]
      }
    });
  }
});

// GET PLAYER INSIGHTS ENDPOINT
router.get('/insights/:user_id', requireAuth, async (req, res) => {
  try {
    const { user_id } = req.params;
    const profile = mem.getProfile(user_id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    const insights = {
      player_overview: {
        name: profile.name || 'Unknown',
        total_chats: profile.totalChats || 0,
        relationship_depth: profile.relationship_building_progress || 'new',
        emotional_support_level: profile.emotional_support_needed ? 'High' : 'Normal'
      },
      emotional_patterns: {
        typical_mood: profile.typical_mood || 'neutral',
        seeks_connection: profile.seeks_connection || false,
        loneliness_indicators: profile.loneliness_indicators?.length || 0,
        emotional_patterns: profile.emotional_patterns?.slice(-5) || []
      },
      gaming_behavior: {
        favorite_games: profile.favoriteGames || [],
        game_frequency: profile.gameFrequency || {},
        playing_style: profile.playingStyle || 'casual',
        deposit_history: profile.depositHistory?.length || 0
      },
      social_connections: {
        preferred_persona: profile.preferredPersona || 'None',
        persona_connections: profile.personaConnections || {},
        trust_level: profile.trust_level || 0,
        connection_score: profile.connection_score || 50
      },
      predictions: {
        predicted_needs: profile.predictedNeeds || [],
        behavior_patterns: profile.behaviorPatterns || [],
        deposit_likelihood: 'Medium' // Calculate based on profile
      }
    };
    
    res.json({ success: true, insights });
  } catch (error) {
    console.error('Error getting player insights:', error);
    res.status(500).json({ error: 'Failed to get player insights' });
  }
});

// GET CASINO ANALYTICS ENDPOINT
router.get('/analytics', requireAuth, async (req, res) => {
  try {
    const stats = mem.getCasinoStats();
    const gameStats = Object.entries(CASINO_GAMES).map(([key, game]) => ({
      name: game.name,
      popularity: game.popularity,
      hot_streak: game.hotStreak,
      status: game.status
    }));
    
    const analytics = {
      ...stats,
      current_games: gameStats,
      promotion_rules: PROMOTION_RULES,
      payment_info: PAYMENT_INFO,
      timestamp: new Date().toISOString()
    };
    
    res.json({ success: true, analytics });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Failed to get analytics' });
  }
});

module.exports = router;