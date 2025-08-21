// utils/auth.js
// Simple "Bearer <token>" auth

module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const expected = process.env.AUTH_TOKEN; // ← use AUTH_TOKEN

  if (!expected) {
    // Server misconfigured – no token set
    return res.status(500).json({ error: 'server auth misconfigured' });
  }

  const ok = header.startsWith('Bearer ') && header.slice(7).trim() === expected;
  if (!ok) return res.status(401).json({ error: 'unauthorized' });

  next();
};