// utils/mem.js
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'memory.db');
// keep the last N messages per user to avoid huge context
const MAX_MESSAGES = 40; // tweak as you like

function load() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return {}; // no file yet
  }
}

function save(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

function getConv(userId) {
  const db = load();
  return db[userId] ?? [];
}

function addTurn(userId, userMsg, assistantMsg) {
  const db = load();
  db[userId] = db[userId] ?? [];
  // store the pair as two chat messages (like OpenAI expects)
  db[userId].push({ role: 'user', content: userMsg, ts: Date.now() });
  db[userId].push({ role: 'assistant', content: assistantMsg, ts: Date.now() });
  // cap length
  if (db[userId].length > MAX_MESSAGES) {
    db[userId] = db[userId].slice(-MAX_MESSAGES);
  }
  save(db);
}

function addMessage(userId, msg) {
  const db = load();
  db[userId] = db[userId] ?? [];
  db[userId].push({ ...msg, ts: Date.now() });
  if (db[userId].length > MAX_MESSAGES) {
    db[userId] = db[userId].slice(-MAX_MESSAGES);
  }
  save(db);
}

function clear(userId) {
  const db = load();
  delete db[userId];
  save(db);
}

function clearAll() {
  save({}); // wipe file
}

function getAll() {
  return load();
}

module.exports = {
  getConv,
  addTurn,
  addMessage,
  getAll,
  clear,
  clearAll,
};