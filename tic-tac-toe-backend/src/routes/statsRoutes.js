const express = require('express');
const { query } = require('express-validator');
const StatsController = require('../controllers/StatsController');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Apply rate limiting
router.use(rateLimiter);

// Stats routes
router.get('/overview', StatsController.getOverallStats);
router.get('/leaderboard', StatsController.getLeaderboard);
router.get('/recent-games', StatsController.getRecentGames);
router.get('/by-period', StatsController.getGamesByPeriod);

module.exports = router;