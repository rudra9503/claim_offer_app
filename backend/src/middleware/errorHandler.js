const AppError = require('../utils/AppError');

// Runs when no route matched the request
const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

// Central place where every error becomes a JSON response
const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message;

  // Mongoose validation failed (e.g. missing required field, invalid price)
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
  }

  // Unique index violated (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = 409;
    message = `Already exists: ${Object.keys(err.keyPattern).join(', ')}`;
  }

  // Request body is not valid JSON
  if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Invalid JSON in request body';
  }

  // Unknown problems: log the details, but do not leak them to the client
  if (statusCode === 500) {
    console.error(err);
    message = 'Something went wrong on the server';
  }

  res.status(statusCode).json({ message });
};

module.exports = { notFound, errorHandler };