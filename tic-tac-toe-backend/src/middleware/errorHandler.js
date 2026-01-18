const config = require('../config');

const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack);

  // Default error
  let error = {
    message: err.message || 'Internal Server Error',
    status: err.status || err.statusCode || 500
  };

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    error.status = 400;
  }

  // Cast errors (invalid ObjectId, etc.)
  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.status = 400;
  }

  // Duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} already exists`;
    error.status = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.status = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.status = 401;
  }

  // SQLite errors
  if (err.code === 'SQLITE_CONSTRAINT') {
    error.message = 'Database constraint violation';
    error.status = 400;
  }

  if (err.code === 'SQLITE_BUSY') {
    error.message = 'Database is busy, please try again';
    error.status = 503;
  }

  // Rate limiting errors
  if (err.status === 429) {
    error.message = 'Too many requests, please try again later';
  }

  // Send error response
  const response = {
    success: false,
    error: error.message,
    status: error.status
  };

  // Include stack trace in development
  if (config.isDevelopment) {
    response.stack = err.stack;
    response.details = err;
  }

  // Log error details
  console.error(`Error ${error.status}: ${error.message}`);
  if (config.isDevelopment) {
    console.error('Full error:', err);
  }

  res.status(error.status).json(response);
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err.message);
  if (config.isDevelopment) {
    console.error('Promise:', promise);
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  console.error('Stack:', err.stack);
  process.exit(1);
});

module.exports = { errorHandler };