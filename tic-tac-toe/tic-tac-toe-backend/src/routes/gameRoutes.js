const express = require('express');
const { body, param, query } = require('express-validator');
const GameController = require('../controllers/GameController');
const { rateLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// Validation rules
const createGameValidation = [
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

const joinGameValidation = [
  param('gameId')
    .isUUID()
    .withMessage('Invalid game ID format'),
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

const makeMoveValidation = [
  param('gameId')
    .isUUID()
    .withMessage('Invalid game ID format'),
  body('playerId')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Player ID must be between 1 and 50 characters'),
  body('position')
    .isInt({ min: 0, max: 8 })
    .withMessage('Position must be an integer between 0 and 8')
];

const gameIdValidation = [
  param('gameId')
    .isUUID()
    .withMessage('Invalid game ID format')
];

const playerActionValidation = [
  param('gameId')
    .isUUID()
    .withMessage('Invalid game ID format'),
  body('playerId')
    .isString()
    .isLength({ min: 1, max: 50 })
    .withMessage('Player ID must be between 1 and 50 characters')
];

// Apply rate limiting
router.use(rateLimiter);

// Game routes
router.post('/create', createGameValidation, GameController.createGame);
router.post('/:gameId/join', joinGameValidation, GameController.joinGame);
router.post('/:gameId/move', makeMoveValidation, GameController.makeMove);
router.get('/waiting', GameController.getWaitingGames);
router.get('/:gameId', gameIdValidation, GameController.getGame);
router.get('/', GameController.getGames);
router.put('/:gameId/reset', playerActionValidation, GameController.resetGame);
router.delete('/:gameId', playerActionValidation, GameController.deleteGame);

module.exports = router;