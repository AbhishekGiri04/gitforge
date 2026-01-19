const express = require('express');
const { body, param } = require('express-validator');
const PlayerController = require('../controllers/PlayerController');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Validation rules
const playerValidation = [
  body('playerId')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Player ID must be between 1 and 50 characters'),
  body('playerName')
    .isString()
    .isLength({ min: 1, max: 30 })
    .trim()
    .withMessage('Player name must be between 1 and 30 characters')
];

const playerIdValidation = [
  param('playerId')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Invalid player ID')
];

// Apply rate limiting
router.use(rateLimiter);

// Player routes
router.get('/', PlayerController.getPlayers);
router.post('/', playerValidation, PlayerController.createOrUpdatePlayer);
router.get('/:playerId', playerIdValidation, PlayerController.getPlayer);
router.get('/:playerId/stats', playerIdValidation, PlayerController.getPlayerStats);

module.exports = router;