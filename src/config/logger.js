const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Set the default log level to 'info'
  format: winston.format.combine(
    winston.format.timestamp(), // Include timestamp in log messages
    winston.format.json(), // Use JSON format for log messages
  ),
  transports: [
    new winston.transports.File({ filename: '../error.log', level: '../error' }), // Log errors to a file
    new winston.transports.File({ filename: 'combined.log' }), // Log all messages to a file
    new winston.transports.Console(), // Log all messages to the console
  ],
});

module.exports = logger;
