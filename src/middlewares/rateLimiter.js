const rateLimit = require('express-rate-limit');

// 🚧 Limit login attempts to prevent brute force
const loginLimiter = rateLimit({
    windowMs: 15 ^ 60 * 1000, // 15 minutes
    max: 5, // Limit to 5 requests per windowMs
    message: { message: '🚫 Too many login attempts. Try again later!' },
    headers: true
});

// 🛡️ Global rate limitng (API protection)
const globalLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // Limit 100 requests per minute per IP,
    message: { message: '⚠️ Too many requests! Please slow down.' }
});

module.exports = { loginLimiter, globalLimiter };