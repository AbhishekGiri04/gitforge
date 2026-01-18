# 🎮 Tic Tac Toe Backend API

Professional Node.js backend for real-time Tic Tac Toe game with SQLite database and Socket.IO support.

## 🚀 Features

- **Real-time Gameplay** with Socket.IO
- **SQLite Database** for persistent storage
- **RESTful API** with comprehensive endpoints
- **Input Validation** with express-validator
- **Rate Limiting** for API protection
- **Error Handling** middleware
- **Unit Tests** with Jest & Supertest
- **Professional Architecture** with MVC pattern
- **Player Statistics** and leaderboards
- **Game Analytics** and reporting

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # API controllers
│   │   ├── GameController.js
│   │   ├── PlayerController.js
│   │   └── StatsController.js
│   ├── models/              # Data models
│   │   ├── Game.js
│   │   └── Player.js
│   ├── routes/              # API routes
│   │   ├── gameRoutes.js
│   │   ├── playerRoutes.js
│   │   └── statsRoutes.js
│   ├── services/            # Business logic
│   │   └── GameService.js
│   ├── middleware/          # Custom middleware
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── utils/               # Utilities
│   │   └── socketHandlers.js
│   ├── config/              # Configuration
│   │   ├── index.js
│   │   ├── database.js
│   │   └── knexfile.js
│   └── server.js            # Main server file
├── database/
│   ├── migrations/          # Database migrations
│   └── seeds/               # Sample data
├── tests/                   # Unit tests
├── docs/                    # Documentation
├── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation
```bash
# Clone repository
git clone <repository-url>
cd tic-tac-toe/backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Setup database
npm run migrate
npm run seed

# Start development server
npm run dev

# Start production server
npm start
```

### Available Scripts
```bash
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
npm run db:setup     # Run migrations and seeds
```

## 📡 API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Game Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `POST` | `/games/create` | Create new game | `{playerId, playerName}` |
| `POST` | `/games/:gameId/join` | Join existing game | `{playerId, playerName}` |
| `POST` | `/games/:gameId/move` | Make a move | `{playerId, position}` |
| `GET` | `/games/:gameId` | Get game by ID | - |
| `GET` | `/games` | Get all games | Query: `status`, `playerId`, `limit`, `offset` |
| `GET` | `/games/waiting` | Get waiting games (lobby) | - |
| `PUT` | `/games/:gameId/reset` | Reset game | `{playerId}` |
| `DELETE` | `/games/:gameId` | Delete game | `{playerId}` |

### Player Management

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| `GET` | `/players` | Get all players | Query: `limit` |
| `POST` | `/players` | Create/update player | `{playerId, playerName}` |
| `GET` | `/players/:playerId` | Get player by ID | - |
| `GET` | `/players/:playerId/stats` | Get player statistics | - |

### Statistics & Analytics

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| `GET` | `/stats/overview` | Overall game statistics | - |
| `GET` | `/stats/leaderboard` | Player leaderboard | `limit` |
| `GET` | `/stats/recent-games` | Recent finished games | `limit` |
| `GET` | `/stats/by-period` | Games by time period | `period` (day/week/month) |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health status |

## 🎯 API Usage Examples

### Create Game
```bash
POST /api/v1/games/create
Content-Type: application/json

{
  "playerId": "user123",
  "playerName": "Alice"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Game created successfully",
  "data": {
    "game": {
      "id": "uuid-here",
      "board": [null, null, null, null, null, null, null, null, null],
      "players": {
        "X": {"id": "user123", "name": "Alice"},
        "O": null
      },
      "currentPlayer": "X",
      "status": "waiting",
      "winner": null,
      "winningLine": null,
      "movesCount": 0
    }
  }
}
```

### Join Game
```bash
POST /api/v1/games/abc123/join
Content-Type: application/json

{
  "playerId": "user456",
  "playerName": "Bob"
}
```

### Make Move
```bash
POST /api/v1/games/abc123/move
Content-Type: application/json

{
  "playerId": "user123",
  "position": 4
}
```

### Get Player Stats
```bash
GET /api/v1/players/user123/stats
```

**Response:**
```json
{
  "success": true,
  "data": {
    "playerId": "user123",
    "playerName": "Alice",
    "stats": {
      "gamesPlayed": 15,
      "gamesWon": 8,
      "gamesDrawn": 3,
      "gamesLost": 4,
      "winRate": 53.3
    }
  }
}
```

## 🔌 Socket.IO Events

### Client → Server Events

| Event | Data | Description |
|-------|------|-------------|
| `joinGame` | `{gameId, playerId}` | Join game room |
| `makeMove` | `{gameId, playerId, position}` | Make a move |
| `resetGame` | `{gameId, playerId}` | Reset game |
| `playerReady` | `{gameId, playerId, ready}` | Set ready status |
| `chatMessage` | `{gameId, playerId, message}` | Send chat message |
| `typing` | `{gameId, playerId, isTyping}` | Typing indicator |
| `spectateGame` | `{gameId}` | Join as spectator |
| `reconnect` | `{gameId, playerId}` | Reconnect to game |
| `ping` | - | Connection test |

### Server → Client Events

| Event | Data | Description |
|-------|------|-------------|
| `gameState` | `{game, spectator?}` | Current game state |
| `gameUpdated` | `{game, lastMove}` | Game state updated |
| `gameEnded` | `{status, result, winner?, duration, totalMoves}` | Game finished |
| `gameReset` | `{game, resetBy}` | Game was reset |
| `playerJoined` | `{playerId, socketId}` | Player joined |
| `playerDisconnected` | `{playerId, socketId}` | Player left |
| `playerReconnected` | `{playerId, socketId}` | Player reconnected |
| `playerReadyStatus` | `{playerId, ready}` | Player ready status |
| `chatMessage` | `{playerId, message, timestamp}` | Chat message |
| `playerTyping` | `{playerId, isTyping}` | Typing indicator |
| `spectatorJoined` | `{socketId}` | New spectator |
| `gameInvitation` | `{gameId, inviterName}` | Game invitation |
| `error` | `{message}` | Error occurred |
| `pong` | `{timestamp}` | Ping response |

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure
- **API Tests**: Complete endpoint testing with supertest
- **Model Tests**: Database model functionality
- **Service Tests**: Business logic validation
- **Integration Tests**: Full workflow testing

## 🔒 Security Features

- **Rate Limiting**: Prevents API abuse and spam
- **Input Validation**: Validates all inputs with express-validator
- **CORS**: Configured for cross-origin requests
- **Helmet**: Security headers middleware
- **Error Handling**: Secure error responses (no stack traces in production)
- **SQL Injection Protection**: Parameterized queries with Knex.js

## 🌍 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development
HOST=0.0.0.0

# Client
CLIENT_URL=http://localhost:3000

# Database
DATABASE_PATH=./database/development.sqlite3

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Game Settings
MAX_GAMES_PER_IP=10
GAME_CLEANUP_INTERVAL=1800000
MAX_GAME_AGE=7200000

# Logging
LOG_LEVEL=info
```

## 🚀 Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start src/server.js --name "tic-tac-toe-api"
pm2 startup
pm2 save
```

### Using Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production database path
3. Set secure JWT secret
4. Configure CORS for production domain
5. Set up SSL/HTTPS
6. Configure logging for production

## 📊 Game Logic

### Board Representation
- 3x3 grid represented as array of 9 elements
- Positions numbered 0-8 (left to right, top to bottom)
- `null` = empty, `'X'` = player X, `'O'` = player O

### Win Conditions
```javascript
const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];
```

### Game States
- `waiting`: Waiting for second player
- `playing`: Game in progress
- `finished`: Game completed
- `abandoned`: Game abandoned by players

### Player Statistics
- Games played, won, drawn, lost
- Win rate calculation
- Leaderboard ranking

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Add tests for new features
4. Ensure all tests pass (`npm test`)
5. Commit changes (`git commit -m 'Add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the test files for usage examples

---

**🎮 Built with ❤️ for the Tic Tac Toe community**