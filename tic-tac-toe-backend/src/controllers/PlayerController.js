const Player = require('../models/Player');
const { validationResult } = require('express-validator');

class PlayerController {
  // Get player by ID
  static async getPlayer(req, res) {
    try {
      const { playerId } = req.params;
      const player = await Player.findById(playerId);

      if (!player) {
        return res.status(404).json({
          success: false,
          error: 'Player not found'
        });
      }

      res.json({
        success: true,
        data: { player: player.toJSON() }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get all players (leaderboard)
  static async getPlayers(req, res) {
    try {
      const { limit = 50 } = req.query;
      const players = await Player.findAll(parseInt(limit));

      res.json({
        success: true,
        data: {
          players: players.map(player => player.toJSON())
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Create or update player
  static async createOrUpdatePlayer(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { playerId, playerName } = req.body;
      const player = await Player.createOrUpdate(playerId, playerName);

      res.json({
        success: true,
        message: 'Player created/updated successfully',
        data: { player: player.toJSON() }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get player statistics
  static async getPlayerStats(req, res) {
    try {
      const { playerId } = req.params;
      const player = await Player.findById(playerId);

      if (!player) {
        return res.status(404).json({
          success: false,
          error: 'Player not found'
        });
      }

      res.json({
        success: true,
        data: {
          playerId: player.id,
          playerName: player.name,
          stats: player.getStats()
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

module.exports = PlayerController;