const { v4: uuidv4 } = require('uuid');

exports.seed = async function(knex) {
  // Clear existing entries
  await knex('games').del();
  await knex('players').del();

  // Insert sample players
  await knex('players').insert([
    {
      id: 'player1',
      name: 'Alice',
      games_played: 15,
      games_won: 8,
      games_drawn: 3,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'player2',
      name: 'Bob',
      games_played: 12,
      games_won: 5,
      games_drawn: 2,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 'player3',
      name: 'Charlie',
      games_played: 8,
      games_won: 6,
      games_drawn: 1,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);

  // Insert sample games
  const gameId1 = uuidv4();
  const gameId2 = uuidv4();
  
  await knex('games').insert([
    {
      id: gameId1,
      board: JSON.stringify(['X', 'O', 'X', 'O', 'X', 'O', null, null, null]),
      players: JSON.stringify({
        X: { id: 'player1', name: 'Alice' },
        O: { id: 'player2', name: 'Bob' }
      }),
      current_player: 'X',
      status: 'playing',
      winner: null,
      winning_line: null,
      moves: JSON.stringify([
        { player: 'X', position: 0, timestamp: new Date() },
        { player: 'O', position: 1, timestamp: new Date() },
        { player: 'X', position: 2, timestamp: new Date() },
        { player: 'O', position: 3, timestamp: new Date() },
        { player: 'X', position: 4, timestamp: new Date() },
        { player: 'O', position: 5, timestamp: new Date() }
      ]),
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: gameId2,
      board: JSON.stringify(['X', 'X', 'X', 'O', 'O', null, null, null, null]),
      players: JSON.stringify({
        X: { id: 'player1', name: 'Alice' },
        O: { id: 'player3', name: 'Charlie' }
      }),
      current_player: 'X',
      status: 'finished',
      winner: 'X',
      winning_line: JSON.stringify([0, 1, 2]),
      moves: JSON.stringify([
        { player: 'X', position: 0, timestamp: new Date() },
        { player: 'O', position: 3, timestamp: new Date() },
        { player: 'X', position: 1, timestamp: new Date() },
        { player: 'O', position: 4, timestamp: new Date() },
        { player: 'X', position: 2, timestamp: new Date() }
      ]),
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);
};