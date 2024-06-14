const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const { env } = require('../../config/vars');

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../../../access.log'),
  {
    flags: 'a',
  },
);

const httpLogger = env === 'development'
  ? morgan('dev')
  : morgan('combined', { stream: accessLogStream });

module.exports = httpLogger;
