exports.up = function(knex) {
  return knex.schema.createTable('players', function(table) {
    table.string('id', 50).primary();
    table.string('name', 30).notNullable();
    table.integer('games_played').defaultTo(0);
    table.integer('games_won').defaultTo(0);
    table.integer('games_drawn').defaultTo(0);
    table.timestamps(true, true);
    
    // Indexes for better performance
    table.index('name');
    table.index('games_played');
    table.index('games_won');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('players');
};