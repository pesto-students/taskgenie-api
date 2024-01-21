const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/v1');
const { logs } = require('./vars');
const passport = require('./passport');
const createError = require('http-errors')
// const strategies = require('./passport')
//const error = require('../api/middlewares/error');

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


// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError.Unauthorized); // Use http-errors to create a 404 error
});

// error handler, send stack trace only during development
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
            status: err.status,
        },
    });
});
module.exports = app;
