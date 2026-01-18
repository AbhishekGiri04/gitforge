class GameStore {
  constructor() {
    this.games = new Map();
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldGames();
    }, 30 * 60 * 1000); // Cleanup every 30 minutes
  }

  // Add game to store
  addGame(game) {
    this.games.set(game.id, game);
    console.log(`🎮 Game created: ${game.id}`);
  }

  // Get game by ID
  getGame(gameId) {
    return this.games.get(gameId);
  }

  // Remove game from store
  removeGame(gameId) {
    const deleted = this.games.delete(gameId);
    if (deleted) {
      console.log(`🗑️ Game deleted: ${gameId}`);
    }
    return deleted;
  }

  // Get all active games
  getActiveGames() {
    return Array.from(this.games.values()).filter(game => 
      game.status === 'waiting' || game.status === 'playing'
    );
  }

  // Get games waiting for players
  getWaitingGames() {
    return Array.from(this.games.values()).filter(game => 
      game.status === 'waiting'
    );
  }

  // Cleanup old finished games
  cleanupOldGames() {
    const now = new Date();
    const maxAge = 2 * 60 * 60 * 1000; // 2 hours

    for (const [gameId, game] of this.games.entries()) {
      const gameAge = now - game.createdAt;
      
      // Remove finished games older than 2 hours
      if (game.status === 'finished' && gameAge > maxAge) {
        this.removeGame(gameId);
      }
      
      // Remove waiting games older than 1 hour
      if (game.status === 'waiting' && gameAge > maxAge / 2) {
        this.removeGame(gameId);
      }
    }
  }

  // Get store statistics
  getStats() {
    const games = Array.from(this.games.values());
    return {
      total: games.length,
      waiting: games.filter(g => g.status === 'waiting').length,
      playing: games.filter(g => g.status === 'playing').length,
      finished: games.filter(g => g.status === 'finished').length
    };
  }
}

// Create singleton instance
const gameStore = new GameStore();

module.exports = { gameStore };