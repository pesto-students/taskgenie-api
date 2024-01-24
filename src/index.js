const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const session = require('express-session');


// open mongoose connection
mongoose.connect();

// Listen to requests
app.listen(port, () => {
  logger.info(`server startged on port ${port} ${env} `);
});

/**
 *  Exports express
 * @public
 */
module.exports = app;
