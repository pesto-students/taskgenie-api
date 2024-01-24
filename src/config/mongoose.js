const mongoose = require('mongoose');
const logger = require('./logger');
const { mongo, env } = require('./vars');

// Exit application on error
mongoose.connection.on('error', (error) => {
  logger.error(`MongoDB connection error: ${error}`);
  process.exit(-1);
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Print mongoose logs in dev environment
if (env === 'development') {
  mongoose.set('debug', true);
}

/**
 * Connect to the mongodb
 * @return {object} Mongoose connection
 * @public
 */

exports.connect = () => {
  mongoose.connect(mongo.uri).then(() => {
    console.log('mongoDB connected ....');
  });
  return mongoose.connection;
};
