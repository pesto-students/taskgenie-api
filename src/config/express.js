const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const passport = require('passport');
const createError = require('http-errors');
const httpStatus = require('http-status');
const routes = require('../api/routes/v1');
const strategies = require('./passport');
const logger = require('./logger');
const httpLogger = require('../api/middlewares/httpLogger.middleware');
/**
 * Express instance
 * @public
 */
const app = express();

app.use(httpLogger); // Log HTTP requests

// parse request body params and attach them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Secure apps by setting various HTTP headers
app.use(helmet());

// Enable CORS
app.use(cors());

// Enable authentication
passport.initialize();
passport.use('jwt', strategies.jwt);
passport.use('google', strategies.google);

// Mount API routes
app.use('/api', routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError.NotFound());
});

// Error handler middleware for handling errors
app.use((err, req, res) => {
  logger.error(err.stack);
  res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR);
  res.json({
    error: {
      message: err.message,
      status: err.status,
    },
  });
});

module.exports = app;
