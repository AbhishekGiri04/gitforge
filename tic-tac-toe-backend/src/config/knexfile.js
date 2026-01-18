const path = require('path');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, '../../database/development.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../../database/migrations')
    },
    seeds: {
      directory: path.join(__dirname, '../../database/seeds')
    }
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: path.join(__dirname, '../../database/production.sqlite3')
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../../database/migrations')
    },
    pool: {
      min: 2,
      max: 10
    }
  },

  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    useNullAsDefault: true,
    migrations: {
      directory: path.join(__dirname, '../../database/migrations')
    }
  }
};