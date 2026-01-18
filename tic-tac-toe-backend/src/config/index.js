const path = require('path');

module.exports = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || '0.0.0.0',
    
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    },
    
    socket: {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      },
      pingTimeout: 60000,
      pingInterval: 25000
    },
    
    security: {
      helmet: {
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
      }
    },
    
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      format: process.env.NODE_ENV === 'production' ? 'combined' : 'dev'
    }
  },
  
  // Database configuration
  database: {
    client: 'sqlite3',
    connection: {
      filename: process.env.NODE_ENV === 'test' 
        ? ':memory:' 
        : path.join(__dirname, `../../database/${process.env.NODE_ENV || 'development'}.sqlite3`)
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../database/seeds')
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  
  // Game configuration
  game: {
    board: {
      size: 3,
      totalCells: 9,
      winningCombinations: [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
      ]
    },
    
    players: {
      maxPlayers: 2,
      symbols: ['X', 'O'],
      firstPlayer: 'X',
      maxNameLength: 30,
      minNameLength: 1
    },
    
    timing: {
      moveTimeout: 30000,
      gameTimeout: 600000,
      reconnectTimeout: 60000
    },
    
    states: {
      WAITING: 'waiting',
      PLAYING: 'playing',
      FINISHED: 'finished',
      ABANDONED: 'abandoned'
    },
    
    cleanup: {
      interval: 30 * 60 * 1000, // 30 minutes
      maxAge: 2 * 60 * 60 * 1000 // 2 hours
    }
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP'
  },
  
  // API configuration
  api: {
    version: 'v1',
    prefix: '/api/v1',
    timeout: 30000
  }
};