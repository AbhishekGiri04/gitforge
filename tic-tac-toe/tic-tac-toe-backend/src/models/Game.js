const { v4: uuidv4 } = require('uuid');
const { db } = require('../config/database');
const config = require('../config');

class Game {
  constructor(data = {}) {
    this.id = data.id || uuidv4();
    this.board = data.board || Array(9).fill(null);
    this.players = data.players || { X: null, O: null };
    this.currentPlayer = data.currentPlayer || 'X';
    this.status = data.status || config.game.states.WAITING;
    this.winner = data.winner || null;
    this.winningLine = data.winningLine || null;
    this.moves = data.moves || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  // Create new game
  static async create(player1Id, player1Name) {
    const game = new Game();
    game.players.X = { id: player1Id, name: player1Name };
    
    await db('games').insert({
      id: game.id,
      board: JSON.stringify(game.board),
      players: JSON.stringify(game.players),
      current_player: game.currentPlayer,
      status: game.status,
      winner: game.winner,
      winning_line: JSON.stringify(game.winningLine),
      moves: JSON.stringify(game.moves)
    });

    return game;
  }

  // Find game by ID
  static async findById(gameId) {
    const gameData = await db('games').where('id', gameId).first();
    if (!gameData) return null;

    return new Game({
      id: gameData.id,
      board: JSON.parse(gameData.board),
      players: JSON.parse(gameData.players),
      currentPlayer: gameData.current_player,
      status: gameData.status,
      winner: gameData.winner,
      winningLine: JSON.parse(gameData.winning_line || 'null'),
      moves: JSON.parse(gameData.moves),
      createdAt: gameData.created_at,
      updatedAt: gameData.updated_at
    });
  }

  // Get all games with filters
  static async findAll(filters = {}) {
    let query = db('games');
    
    if (filters.status) {
      query = query.where('status', filters.status);
    }
    
    if (filters.playerId) {
      query = query.where(function() {
        this.whereRaw('JSON_EXTRACT(players, \"$.X.id\") = ?', [filters.playerId])
            .orWhereRaw('JSON_EXTRACT(players, \"$.O.id\") = ?', [filters.playerId]);
      });
    }

    const games = await query.orderBy('created_at', 'desc');
    
    return games.map(gameData => new Game({
      id: gameData.id,
      board: JSON.parse(gameData.board),
      players: JSON.parse(gameData.players),
      currentPlayer: gameData.current_player,
      status: gameData.status,
      winner: gameData.winner,
      winningLine: JSON.parse(gameData.winning_line || 'null'),
      moves: JSON.parse(gameData.moves),
      createdAt: gameData.created_at,
      updatedAt: gameData.updated_at
    }));
  }

  // Add second player
  async addPlayer(player2Id, player2Name) {
    if (this.players.O) {
      throw new Error('Game is already full');
    }
    
    this.players.O = { id: player2Id, name: player2Name };
    this.status = config.game.states.PLAYING;
    
    await this.save();
    return this;
  }

  // Make a move
  async makeMove(playerId, position) {
    this.validateMove(playerId, position);
    
    const playerSymbol = this.getPlayerSymbol(playerId);
    this.board[position] = playerSymbol;
    
    this.moves.push({
      player: playerSymbol,
      position,
      timestamp: new Date()
    });

    this.checkWinner();
    
    if (this.status === config.game.states.PLAYING) {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    await this.save();
    return this;
  }

  // Validate move
  validateMove(playerId, position) {
    if (this.status !== config.game.states.PLAYING) {
      throw new Error('Game is not in playing state');
    }

    if (position < 0 || position > 8) {
      throw new Error('Invalid position');
    }

    if (this.board[position] !== null) {
      throw new Error('Position already occupied');
    }

    const playerSymbol = this.getPlayerSymbol(playerId);
    if (!playerSymbol) {
      throw new Error('Player not in this game');
    }

    if (playerSymbol !== this.currentPlayer) {
      throw new Error('Not your turn');
    }
  }

  // Get player symbol by ID
  getPlayerSymbol(playerId) {
    if (this.players.X && this.players.X.id === playerId) return 'X';
    if (this.players.O && this.players.O.id === playerId) return 'O';
    return null;
  }

  // Check for winner
  checkWinner() {
    const { winningCombinations } = config.game.board;

    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        this.winner = this.board[a];
        this.winningLine = combination;
        this.status = config.game.states.FINISHED;
        return;
      }
    }

    // Check for draw
    if (this.board.every(cell => cell !== null)) {
      this.status = config.game.states.FINISHED;
      this.winner = 'draw';
    }
  }

  // Reset game
  async reset() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.status = this.players.O ? config.game.states.PLAYING : config.game.states.WAITING;
    this.winner = null;
    this.winningLine = null;
    this.moves = [];
    
    await this.save();
    return this;
  }

  // Save to database
  async save() {
    this.updatedAt = new Date();
    
    await db('games').where('id', this.id).update({
      board: JSON.stringify(this.board),
      players: JSON.stringify(this.players),
      current_player: this.currentPlayer,
      status: this.status,
      winner: this.winner,
      winning_line: JSON.stringify(this.winningLine),
      moves: JSON.stringify(this.moves),
      updated_at: this.updatedAt
    });
  }

  // Delete game
  async delete() {
    await db('games').where('id', this.id).del();
  }

  // Check if player is in game
  hasPlayer(playerId) {
    return (this.players.X && this.players.X.id === playerId) ||
           (this.players.O && this.players.O.id === playerId);
  }

  // Get game state for API response
  toJSON() {
    return {
      id: this.id,
      board: this.board,
      players: this.players,
      currentPlayer: this.currentPlayer,
      status: this.status,
      winner: this.winner,
      winningLine: this.winningLine,
      movesCount: this.moves.length,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Game;