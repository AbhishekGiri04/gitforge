module.exports = {
  // Game board settings
  board: {
    size: 3,
    totalCells: 9,
    winningCombinations: [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ]
  },
  
  // Player settings
  players: {
    maxPlayers: 2,
    symbols: ['X', 'O'],
    firstPlayer: 'X',
    maxNameLength: 30,
    minNameLength: 1
  },
  
  // Game timing
  timing: {
    moveTimeout: 30000, // 30 seconds per move
    gameTimeout: 600000, // 10 minutes total game time
    reconnectTimeout: 60000 // 1 minute to reconnect
  },
  
  // Game states
  states: {
    WAITING: 'waiting',
    PLAYING: 'playing',
    FINISHED: 'finished',
    ABANDONED: 'abandoned'
  },
  
  // Game results
  results: {
    WIN: 'win',
    DRAW: 'draw',
    TIMEOUT: 'timeout',
    ABANDONED: 'abandoned'
  },
  
  // Validation rules
  validation: {
    playerIdMinLength: 1,
    playerIdMaxLength: 50,
    gameIdLength: 36, // UUID length
    maxConcurrentGames: 100
  },
  
  // Scoring system (for future use)
  scoring: {
    winPoints: 3,
    drawPoints: 1,
    lossPoints: 0,
    timeoutPenalty: -1
  }
};