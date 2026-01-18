const Game = require('../src/models/Game');

describe('Game Model', () => {
  let game;
  const player1Id = 'player1';
  const player1Name = 'Alice';
  const player2Id = 'player2';
  const player2Name = 'Bob';

  beforeEach(() => {
    game = new Game(player1Id, player1Name);
  });

  describe('Game Creation', () => {
    test('should create a new game with correct initial state', () => {
      expect(game.id).toBeDefined();
      expect(game.board).toEqual(Array(9).fill(null));
      expect(game.players.X).toEqual({ id: player1Id, name: player1Name });
      expect(game.players.O).toBeNull();
      expect(game.currentPlayer).toBe('X');
      expect(game.status).toBe('waiting');
    });
  });

  describe('Adding Players', () => {
    test('should add second player successfully', () => {
      game.addPlayer(player2Id, player2Name);
      
      expect(game.players.O).toEqual({ id: player2Id, name: player2Name });
      expect(game.status).toBe('playing');
    });

    test('should throw error when trying to add third player', () => {
      game.addPlayer(player2Id, player2Name);
      
      expect(() => {
        game.addPlayer('player3', 'Charlie');
      }).toThrow('Game is already full');
    });
  });

  describe('Making Moves', () => {
    beforeEach(() => {
      game.addPlayer(player2Id, player2Name);
    });

    test('should make valid move successfully', () => {
      const result = game.makeMove(player1Id, 0);
      
      expect(game.board[0]).toBe('X');
      expect(game.currentPlayer).toBe('O');
      expect(result.moves).toBe(1);
    });

    test('should throw error for invalid position', () => {
      expect(() => {
        game.makeMove(player1Id, 9);
      }).toThrow('Invalid position');
    });

    test('should throw error for occupied position', () => {
      game.makeMove(player1Id, 0);
      
      expect(() => {
        game.makeMove(player2Id, 0);
      }).toThrow('Position already occupied');
    });

    test('should throw error when not player turn', () => {
      expect(() => {
        game.makeMove(player2Id, 0);
      }).toThrow('Not your turn');
    });
  });

  describe('Win Detection', () => {
    beforeEach(() => {
      game.addPlayer(player2Id, player2Name);
    });

    test('should detect horizontal win', () => {
      // X wins with top row
      game.makeMove(player1Id, 0); // X
      game.makeMove(player2Id, 3); // O
      game.makeMove(player1Id, 1); // X
      game.makeMove(player2Id, 4); // O
      game.makeMove(player1Id, 2); // X wins
      
      expect(game.winner).toBe('X');
      expect(game.status).toBe('finished');
      expect(game.winningLine).toEqual([0, 1, 2]);
    });

    test('should detect draw', () => {
      // Create a draw scenario
      const moves = [
        [player1Id, 0], [player2Id, 1], [player1Id, 2],
        [player2Id, 3], [player2Id, 4], [player1Id, 5],
        [player1Id, 6], [player1Id, 7], [player2Id, 8]
      ];
      
      moves.forEach(([playerId, position]) => {
        game.makeMove(playerId, position);
      });
      
      expect(game.winner).toBe('draw');
      expect(game.status).toBe('finished');
    });
  });

  describe('Game Reset', () => {
    beforeEach(() => {
      game.addPlayer(player2Id, player2Name);
      game.makeMove(player1Id, 0);
      game.makeMove(player2Id, 1);
    });

    test('should reset game state correctly', () => {
      game.reset();
      
      expect(game.board).toEqual(Array(9).fill(null));
      expect(game.currentPlayer).toBe('X');
      expect(game.status).toBe('playing');
      expect(game.winner).toBeNull();
      expect(game.moves).toEqual([]);
    });
  });
});