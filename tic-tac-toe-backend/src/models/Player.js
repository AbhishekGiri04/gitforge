const { db } = require('../config/database');

class Player {
  constructor(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.gamesPlayed = data.gamesPlayed || 0;
    this.gamesWon = data.gamesWon || 0;
    this.gamesDrawn = data.gamesDrawn || 0;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Create or update player
  static async createOrUpdate(playerId, playerName) {
    const existingPlayer = await db('players').where('id', playerId).first();
    
    if (existingPlayer) {
      await db('players').where('id', playerId).update({
        name: playerName,
        updated_at: new Date()
      });
      
      return new Player({
        id: existingPlayer.id,
        name: playerName,
        gamesPlayed: existingPlayer.games_played,
        gamesWon: existingPlayer.games_won,
        gamesDrawn: existingPlayer.games_drawn,
        createdAt: existingPlayer.created_at,
        updatedAt: new Date()
      });
    } else {
      await db('players').insert({
        id: playerId,
        name: playerName,
        games_played: 0,
        games_won: 0,
        games_drawn: 0
      });
      
      return new Player({
        id: playerId,
        name: playerName
      });
    }
  }

  // Find player by ID
  static async findById(playerId) {
    const playerData = await db('players').where('id', playerId).first();
    if (!playerData) return null;

    return new Player({
      id: playerData.id,
      name: playerData.name,
      gamesPlayed: playerData.games_played,
      gamesWon: playerData.games_won,
      gamesDrawn: playerData.games_drawn,
      createdAt: playerData.created_at,
      updatedAt: playerData.updated_at
    });
  }

  // Get all players with stats
  static async findAll(limit = 50) {
    const players = await db('players')
      .orderBy('games_won', 'desc')
      .limit(limit);
    
    return players.map(playerData => new Player({
      id: playerData.id,
      name: playerData.name,
      gamesPlayed: playerData.games_played,
      gamesWon: playerData.games_won,
      gamesDrawn: playerData.games_drawn,
      createdAt: playerData.created_at,
      updatedAt: playerData.updated_at
    }));
  }

  // Update player stats after game
  static async updateStats(playerId, result) {
    const player = await Player.findById(playerId);
    if (!player) return;

    const updates = {
      games_played: player.gamesPlayed + 1,
      updated_at: new Date()
    };

    if (result === 'win') {
      updates.games_won = player.gamesWon + 1;
    } else if (result === 'draw') {
      updates.games_drawn = player.gamesDrawn + 1;
    }

    await db('players').where('id', playerId).update(updates);
  }

  // Get player statistics
  getStats() {
    const gamesLost = this.gamesPlayed - this.gamesWon - this.gamesDrawn;
    const winRate = this.gamesPlayed > 0 ? (this.gamesWon / this.gamesPlayed * 100).toFixed(1) : 0;
    
    return {
      gamesPlayed: this.gamesPlayed,
      gamesWon: this.gamesWon,
      gamesDrawn: this.gamesDrawn,
      gamesLost,
      winRate: parseFloat(winRate)
    };
  }

  // Convert to JSON for API response
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      stats: this.getStats(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Player;