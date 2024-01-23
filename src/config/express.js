const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('../api/routes/v1');
const { mongo, logs } = require('./vars');
const passport = require('./passport');
const createError = require('http-errors')
// const strategies = require('./passport')
//const error = require('../api/middlewares/error');
const session = require('express-session');
const { sessionSecret } = require('./config/vars');
const MongoStore = require('connect-mongo');

/**
 * Express instance
 * @public
 */
const app = express();

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({mongoUrl: mongo.uri , collectionName: 'users' }),
    cookie: {
        maxAge: 1000*60*60*24
    }
}))

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
// initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Mount api routes
app.use('/api', routes);


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
