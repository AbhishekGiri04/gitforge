exports.up = function(knex) {
  return knex.schema.createTable('games', function(table) {
    table.string('id', 36).primary();
    table.json('board').notNullable();
    table.json('players').notNullable();
    table.string('current_player', 1).notNullable();
    table.enum('status', ['waiting', 'playing', 'finished', 'abandoned']).notNullable().defaultTo('waiting');
    table.string('winner', 10).nullable();
    table.json('winning_line').nullable();
    table.json('moves').notNullable();
    table.timestamps(true, true);
    
    // Indexes for better performance
    table.index('status');
    table.index('created_at');
    table.index('updated_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('games');
};