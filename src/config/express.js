const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/v1');
const { logs } = require('./vars');
// const strategies = require('./passport')
const error = require('../api/middlewares/error');

/**
 * Express instance
 * @public
 */
const app = express();

// Request logging. dev: console | Production: file
//initialize morgan (for logger)
app.use(morgan(logs));

// parse request body  params and attah them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// secure apps by setting various HTTP headers
app.use(helmet());

// enable CORS
app.use(cors());

// Todo: enable passport authentication
//initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Mount api routes
app.use('/', routes);


// Todo change error handling according to http-error library
// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktracer only during development
app.use(error.handler);

module.exports = app;
