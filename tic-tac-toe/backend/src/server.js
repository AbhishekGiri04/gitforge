const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const config = require('./config');
const gameRoutes = require('./routes/gameRoutes');
const playerRoutes = require('./routes/playerRoutes');
const statsRoutes = require('./routes/statsRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const { setupSocketHandlers } = require('./utils/socketHandlers');
const { initializeDatabase } = require('./config/database');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, config.server.socket);

const PORT = config.server.port;

// Initialize database
initializeDatabase();

// Middleware
app.use(helmet(config.server.security.helmet));
app.use(cors(config.server.cors));
app.use(compression());
app.use(morgan(config.server.logging.format));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/v1/games', gameRoutes);
app.use('/api/v1/players', playerRoutes);
app.use('/api/v1/stats', statsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Tic Tac Toe API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Info
app.get('/api/v1', (req, res) => {
  res.json({
    name: 'Tic Tac Toe API',
    version: '1.0.0',
    endpoints: {
      games: '/api/v1/games',
      players: '/api/v1/players',
      stats: '/api/v1/stats',
      health: '/health'
    }
  });
});

// Socket.IO setup
setupSocketHandlers(io);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    message: 'The requested endpoint does not exist'
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Tic Tac Toe Server running on port ${PORT}`);
  console.log(`📡 Socket.IO enabled for real-time gameplay`);
  console.log(`🗄️ SQLite database initialized`);
  console.log(`🌍 Environment: ${config.env}`);
});

module.exports = { app, server, io };