const rateLimit = require('express-rate-limit');
const config = require('../config');

// General rate limiter
const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    error: config.rateLimit.message,
    retryAfter: Math.ceil(config.rateLimit.windowMs / 1000 / 60) + ' minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.ceil(config.rateLimit.windowMs / 1000 / 60) + ' minutes'
    });
  }
});

// Stricter rate limiter for game creation
const createGameLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // Limit each IP to 10 game creations per 5 minutes
  message: {
    success: false,
    error: 'Too many games created from this IP, please try again later.',
    retryAfter: '5 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many games created from this IP, please try again later.',
      retryAfter: '5 minutes'
    });
  }
});

// Move rate limiter (prevent spam moves)
const moveLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 moves per minute should be enough
  message: {
    success: false,
    error: 'Too many moves, please slow down.',
    retryAfter: '1 minute'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many moves, please slow down.',
      retryAfter: '1 minute'
    });
  }
});

module.exports = {
  rateLimiter,
  createGameLimiter,
  moveLimiter
};