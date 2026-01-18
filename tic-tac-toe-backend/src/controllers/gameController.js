const Game = require('../models/Game');
const Player = require('../models/Player');
const GameService = require('../services/GameService');
const { validationResult } = require('express-validator');

class GameController {
  // Create new game
  static async createGame(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { playerId, playerName } = req.body;
      
      // Create or update player
      await Player.createOrUpdate(playerId, playerName);
      
      // Create game
      const game = await Game.create(playerId, playerName);

      res.status(201).json({
        success: true,
        message: 'Game created successfully',
        data: { game: game.toJSON() }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Join existing game
  static async joinGame(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { gameId } = req.params;
      const { playerId, playerName } = req.body;

      const game = await Game.findById(gameId);
      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Game not found'
        });
      }

      // Create or update player
      await Player.createOrUpdate(playerId, playerName);
      
      // Join game
      await game.addPlayer(playerId, playerName);

      res.json({
        success: true,
        message: 'Joined game successfully',
        data: { game: game.toJSON() }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Make a move
  static async makeMove(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { gameId } = req.params;
      const { playerId, position } = req.body;

      const game = await Game.findById(gameId);
      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Game not found'
        });
      }

      await game.makeMove(playerId, position);

      // Update player stats if game finished
      if (game.status === 'finished') {
        await GameService.updatePlayerStats(game);
      }

      res.json({
        success: true,
        message: 'Move made successfully',
        data: { game: game.toJSON() }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get game by ID
  static async getGame(req, res) {
    try {
      const { gameId } = req.params;
      const game = await Game.findById(gameId);

      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Game not found'
        });
      }

      res.json({
        success: true,
        data: { game: game.toJSON() }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get all games with filters
  static async getGames(req, res) {
    try {
      const { status, playerId, limit = 20, offset = 0 } = req.query;
      
      const filters = {};
      if (status) filters.status = status;
      if (playerId) filters.playerId = playerId;

      const games = await Game.findAll(filters);
      
      // Apply pagination
      const paginatedGames = games.slice(offset, offset + parseInt(limit));

      res.json({
        success: true,
        data: {
          games: paginatedGames.map(game => game.toJSON()),
          pagination: {
            total: games.length,
            limit: parseInt(limit),
            offset: parseInt(offset)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Reset game
  static async resetGame(req, res) {
    try {
      const { gameId } = req.params;
      const { playerId } = req.body;

      const game = await Game.findById(gameId);
      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Game not found'
        });
      }

      if (!game.hasPlayer(playerId)) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to reset this game'
        });
      }

      await game.reset();

      res.json({
        success: true,
        message: 'Game reset successfully',
        data: { game: game.toJSON() }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Delete game
  static async deleteGame(req, res) {
    try {
      const { gameId } = req.params;
      const { playerId } = req.body;

      const game = await Game.findById(gameId);
      if (!game) {
        return res.status(404).json({
          success: false,
          error: 'Game not found'
        });
      }

      if (!game.hasPlayer(playerId)) {
        return res.status(403).json({
          success: false,
          error: 'Not authorized to delete this game'
        });
      }

      await game.delete();

      res.json({
        success: true,
        message: 'Game deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get waiting games (lobby)
  static async getWaitingGames(req, res) {
    try {
      const games = await Game.findAll({ status: 'waiting' });

      res.json({
        success: true,
        data: {
          games: games.map(game => game.toJSON())
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = GameController;