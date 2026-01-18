const Game = require('../models/Game');
const GameService = require('../services/GameService');

function setupSocketHandlers(io) {
  io.on('connection', (socket) => {
    console.log(`🔌 User connected: ${socket.id}`);

    // Join game room
    socket.on('joinGame', async (data) => {
      try {
        const { gameId, playerId } = data;
        
        const game = await Game.findById(gameId);
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        if (!game.hasPlayer(playerId)) {
          socket.emit('error', { message: 'You are not a player in this game' });
          return;
        }

        socket.join(gameId);
        socket.gameId = gameId;
        socket.playerId = playerId;
        
        console.log(`👤 Player ${playerId} joined game ${gameId}`);
        
        // Notify others in the room
        socket.to(gameId).emit('playerJoined', {
          message: 'A player joined the game',
          playerId,
          socketId: socket.id
        });

        // Send current game state
        socket.emit('gameState', {
          game: game.toJSON()
        });
        
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle move made
    socket.on('makeMove', async (data) => {
      try {
        const { gameId, playerId, position } = data;
        
        const game = await Game.findById(gameId);
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        // Validate move before making it
        if (!GameService.isValidMove(game, playerId, position)) {
          socket.emit('error', { message: 'Invalid move' });
          return;
        }

        await game.makeMove(playerId, position);
        
        // Broadcast move to all players in the game
        io.to(gameId).emit('gameUpdated', {
          game: game.toJSON(),
          lastMove: { 
            playerId, 
            position,
            symbol: game.getPlayerSymbol(playerId)
          }
        });

        // Check if game ended
        if (game.status === 'finished') {
          const gameResult = GameService.getGameResult(game);
          
          io.to(gameId).emit('gameEnded', gameResult);
          
          // Update player stats
          await GameService.updatePlayerStats(game);
        }
        
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle game reset
    socket.on('resetGame', async (data) => {
      try {
        const { gameId, playerId } = data;
        
        const game = await Game.findById(gameId);
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        if (!game.hasPlayer(playerId)) {
          socket.emit('error', { message: 'Not authorized to reset this game' });
          return;
        }

        await game.reset();
        
        // Broadcast reset to all players
        io.to(gameId).emit('gameReset', {
          game: game.toJSON(),
          resetBy: playerId
        });
        
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle player ready status
    socket.on('playerReady', (data) => {
      const { gameId, playerId, ready } = data;
      
      socket.to(gameId).emit('playerReadyStatus', {
        playerId,
        ready
      });
    });

    // Handle chat messages
    socket.on('chatMessage', (data) => {
      const { gameId, playerId, message } = data;
      
      if (!message || message.trim().length === 0) return;
      
      const chatData = {
        playerId,
        message: message.trim().substring(0, 200), // Limit message length
        timestamp: new Date().toISOString()
      };
      
      io.to(gameId).emit('chatMessage', chatData);
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const { gameId, playerId, isTyping } = data;
      
      socket.to(gameId).emit('playerTyping', {
        playerId,
        isTyping
      });
    });

    // Handle game invitation
    socket.on('invitePlayer', (data) => {
      const { gameId, invitedPlayerId, inviterName } = data;
      
      // Find socket of invited player (this would need a player-socket mapping)
      // For now, broadcast to all sockets
      socket.broadcast.emit('gameInvitation', {
        gameId,
        inviterName,
        message: `${inviterName} invited you to play Tic Tac Toe`
      });
    });

    // Handle spectator joining
    socket.on('spectateGame', async (data) => {
      try {
        const { gameId } = data;
        
        const game = await Game.findById(gameId);
        if (!game) {
          socket.emit('error', { message: 'Game not found' });
          return;
        }

        socket.join(`${gameId}-spectators`);
        
        // Send current game state to spectator
        socket.emit('gameState', {
          game: game.toJSON(),
          spectator: true
        });
        
        // Notify players about new spectator
        socket.to(gameId).emit('spectatorJoined', {
          socketId: socket.id
        });
        
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.id}`);
      
      if (socket.gameId) {
        // Notify game room about disconnection
        socket.to(socket.gameId).emit('playerDisconnected', {
          playerId: socket.playerId,
          socketId: socket.id,
          message: 'A player disconnected'
        });
      }
    });

    // Handle reconnection
    socket.on('reconnect', async (data) => {
      try {
        const { gameId, playerId } = data;
        
        const game = await Game.findById(gameId);
        if (game && game.hasPlayer(playerId)) {
          socket.join(gameId);
          socket.gameId = gameId;
          socket.playerId = playerId;
          
          // Send current game state
          socket.emit('gameState', {
            game: game.toJSON()
          });
          
          // Notify others about reconnection
          socket.to(gameId).emit('playerReconnected', {
            playerId,
            socketId: socket.id
          });
        }
        
      } catch (error) {
        socket.emit('error', { message: error.message });
      }
    });

    // Handle ping for connection testing
    socket.on('ping', () => {
      socket.emit('pong', { timestamp: Date.now() });
    });
  });

  // Handle server-side events
  io.engine.on('connection_error', (err) => {
    console.log('Connection error:', err.req);
    console.log('Error code:', err.code);
    console.log('Error message:', err.message);
    console.log('Error context:', err.context);
  });
}

module.exports = { setupSocketHandlers };