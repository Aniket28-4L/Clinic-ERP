const rateLimit = require("express-rate-limit");

function createApiRateLimiter() {
  return rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300, // clinic systems can be chatty; tune per environment
    standardHeaders: "draft-8",
    legacyHeaders: false,
  });
}

module.exports = { createApiRateLimiter };

