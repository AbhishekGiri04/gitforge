const knex = require('knex');
const config = require('./index');

// Initialize Knex with configuration
const db = knex(config.database);

// Initialize database
async function initializeDatabase() {
  try {
    // Test connection
    await db.raw('SELECT 1');
    console.log('✅ SQLite database connected successfully');
    
    // Run migrations
    await db.migrate.latest();
    console.log('✅ Database migrations completed');
    
    // Run seeds in development
    if (config.isDevelopment) {
      await db.seed.run();
      console.log('✅ Database seeds completed');
    }
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

// Cleanup old games
async function cleanupOldGames() {
  try {
    const cutoffTime = new Date(Date.now() - config.game.cleanup.maxAge);
    
    const deletedCount = await db('games')
      .where('status', 'finished')
      .andWhere('updated_at', '<', cutoffTime)
      .del();
    
    if (deletedCount > 0) {
      console.log(`🧹 Cleaned up ${deletedCount} old games`);
    }
  } catch (error) {
    console.error('❌ Game cleanup failed:', error.message);
  }
}

// Start cleanup interval
setInterval(cleanupOldGames, config.game.cleanup.interval);

module.exports = {
  db,
  initializeDatabase,
  cleanupOldGames
};