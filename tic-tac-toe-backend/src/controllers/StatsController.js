const { db } = require('../config/database');

class StatsController {
  // Get overall game statistics
  static async getOverallStats(req, res) {
    try {
      const [gameStats, playerStats] = await Promise.all([
        db('games').select(
          db.raw('COUNT(*) as total_games'),
          db.raw('COUNT(CASE WHEN status = "finished" THEN 1 END) as finished_games'),
          db.raw('COUNT(CASE WHEN status = "playing" THEN 1 END) as active_games'),
          db.raw('COUNT(CASE WHEN status = "waiting" THEN 1 END) as waiting_games'),
          db.raw('COUNT(CASE WHEN winner = "draw" THEN 1 END) as draws'),
          db.raw('COUNT(CASE WHEN winner = "X" THEN 1 END) as x_wins'),
          db.raw('COUNT(CASE WHEN winner = "O" THEN 1 END) as o_wins')
        ).first(),
        
        db('players').select(
          db.raw('COUNT(*) as total_players'),
          db.raw('SUM(games_played) as total_games_played'),
          db.raw('AVG(games_played) as avg_games_per_player')
        ).first()
      ]);

      res.json({
        success: true,
        data: {
          games: {
            total: gameStats.total_games,
            finished: gameStats.finished_games,
            active: gameStats.active_games,
            waiting: gameStats.waiting_games,
            draws: gameStats.draws,
            xWins: gameStats.x_wins,
            oWins: gameStats.o_wins
          },
          players: {
            total: playerStats.total_players,
            totalGamesPlayed: playerStats.total_games_played,
            averageGamesPerPlayer: Math.round(playerStats.avg_games_per_player || 0)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get leaderboard
  static async getLeaderboard(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      const leaderboard = await db('players')
        .select('id', 'name', 'games_played', 'games_won', 'games_drawn')
        .where('games_played', '>', 0)
        .orderBy('games_won', 'desc')
        .orderBy('games_played', 'asc')
        .limit(parseInt(limit));

      const formattedLeaderboard = leaderboard.map((player, index) => {
        const gamesLost = player.games_played - player.games_won - player.games_drawn;
        const winRate = player.games_played > 0 
          ? (player.games_won / player.games_played * 100).toFixed(1) 
          : 0;

        return {
          rank: index + 1,
          playerId: player.id,
          playerName: player.name,
          gamesPlayed: player.games_played,
          gamesWon: player.games_won,
          gamesDrawn: player.games_drawn,
          gamesLost,
          winRate: parseFloat(winRate)
        };
      });

      res.json({
        success: true,
        data: { leaderboard: formattedLeaderboard }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get recent games
  static async getRecentGames(req, res) {
    try {
      const { limit = 10 } = req.query;
      
      const recentGames = await db('games')
        .select('id', 'players', 'status', 'winner', 'created_at', 'updated_at')
        .where('status', 'finished')
        .orderBy('updated_at', 'desc')
        .limit(parseInt(limit));

      const formattedGames = recentGames.map(game => {
        const players = JSON.parse(game.players);
        return {
          gameId: game.id,
          players: {
            X: players.X ? players.X.name : null,
            O: players.O ? players.O.name : null
          },
          winner: game.winner,
          finishedAt: game.updated_at
        };
      });

      res.json({
        success: true,
        data: { recentGames: formattedGames }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // Get game statistics by time period
  static async getGamesByPeriod(req, res) {
    try {
      const { period = 'day' } = req.query; // day, week, month
      
      let dateFormat;
      switch (period) {
        case 'week':
          dateFormat = '%Y-%W';
          break;
        case 'month':
          dateFormat = '%Y-%m';
          break;
        default:
          dateFormat = '%Y-%m-%d';
      }

      const stats = await db('games')
        .select(
          db.raw(`strftime('${dateFormat}', created_at) as period`),
          db.raw('COUNT(*) as games_count'),
          db.raw('COUNT(CASE WHEN status = "finished" THEN 1 END) as finished_count')
        )
        .groupBy('period')
        .orderBy('period', 'desc')
        .limit(30);

      res.json({
        success: true,
        data: { 
          period,
          stats 
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = StatsController;