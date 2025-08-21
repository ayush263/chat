// utils/auth.js
// Very small "Bearer <token>" check.

module.exports = function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const expected = process.env.SECRET_TOKEN;

  if (!expected) {
    // If you forget to set SECRET_TOKEN, fail closed.
    return res.status(500).json({ error: 'server auth misconfigured' });
  }

  // Header must look like: "Bearer my-secret-token"
  const ok = header.startsWith('Bearer ') && header.slice(7) === expected;
  if (!ok) return res.status(401).json({ error: 'unauthorized' });

  next();
};