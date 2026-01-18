const Player = require('../models/Player');

class GameService {
  // Update player statistics after game completion
  static async updatePlayerStats(game) {
    if (game.status !== 'finished') return;

    const playerX = game.players.X;
    const playerO = game.players.O;

    if (!playerX || !playerO) return;

    if (game.winner === 'draw') {
      // Both players get a draw
      await Promise.all([
        Player.updateStats(playerX.id, 'draw'),
        Player.updateStats(playerO.id, 'draw')
      ]);
    } else if (game.winner === 'X') {
      // X wins, O loses
      await Promise.all([
        Player.updateStats(playerX.id, 'win'),
        Player.updateStats(playerO.id, 'loss')
      ]);
    } else if (game.winner === 'O') {
      // O wins, X loses
      await Promise.all([
        Player.updateStats(playerO.id, 'win'),
        Player.updateStats(playerX.id, 'loss')
      ]);
    }
  }

  // Validate game state
  static validateGameState(game) {
    const errors = [];

    // Check board validity
    if (!Array.isArray(game.board) || game.board.length !== 9) {
      errors.push('Invalid board state');
    }

    // Check players
    if (!game.players.X) {
      errors.push('Missing player X');
    }

    if (game.status === 'playing' && !game.players.O) {
      errors.push('Missing player O for playing game');
    }

    // Check current player
    if (!['X', 'O'].includes(game.currentPlayer)) {
      errors.push('Invalid current player');
    }

    return errors;
  }

  // Calculate game duration
  static getGameDuration(game) {
    if (!game.createdAt || !game.updatedAt) return 0;
    
    const start = new Date(game.createdAt);
    const end = new Date(game.updatedAt);
    
    return Math.floor((end - start) / 1000); // Duration in seconds
  }

  // Get game result summary
  static getGameResult(game) {
    if (game.status !== 'finished') {
      return { status: 'ongoing' };
    }

    const duration = this.getGameDuration(game);
    const totalMoves = game.moves.length;

    if (game.winner === 'draw') {
      return {
        status: 'finished',
        result: 'draw',
        duration,
        totalMoves
      };
    }

    const winner = game.winner === 'X' ? game.players.X : game.players.O;
    const loser = game.winner === 'X' ? game.players.O : game.players.X;

    return {
      status: 'finished',
      result: 'win',
      winner: {
        symbol: game.winner,
        id: winner.id,
        name: winner.name
      },
      loser: {
        symbol: game.winner === 'X' ? 'O' : 'X',
        id: loser.id,
        name: loser.name
      },
      winningLine: game.winningLine,
      duration,
      totalMoves
    };
  }

  // Check if move is valid without modifying game state
  static isValidMove(game, playerId, position) {
    try {
      // Check game status
      if (game.status !== 'playing') return false;

      // Check position
      if (position < 0 || position > 8) return false;

      // Check if position is empty
      if (game.board[position] !== null) return false;

      // Check player turn
      const playerSymbol = game.getPlayerSymbol(playerId);
      if (!playerSymbol || playerSymbol !== game.currentPlayer) return false;

      return true;
    } catch (error) {
      return false;
    }
  }

  // Get available moves
  static getAvailableMoves(game) {
    return game.board
      .map((cell, index) => cell === null ? index : null)
      .filter(index => index !== null);
  }

  // Simple AI move (for single player mode)
  static getAIMove(game) {
    const availableMoves = this.getAvailableMoves(game);
    
    if (availableMoves.length === 0) return null;

    // Simple random move for now
    const randomIndex = Math.floor(Math.random() * availableMoves.length);
    return availableMoves[randomIndex];
  }
}

module.exports = GameService;