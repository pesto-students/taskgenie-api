/* eslint-disable no-underscore-dangle */
/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const createHttpError = require('http-errors');

const refreshTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  userEmail: {
    type: 'String',
    required: true,
    ref: 'User',
  },
  refreshToken: {
    type: 'String',
    required: true,
    index: true,
  },
  expires: {
    type: Date,
  },
});

refreshTokenSchema.statics = {
  // generate a refresh token object and saves it into the database
  async generate(user) {
    try {
      const userId = user._id;
      const userEmail = user.email;
      const expiresOn = moment()
        .add(30, 'days')
        .toDate();
      const token = uuidv4();
      const values = {
        userId,
        userEmail,
        refreshToken: token,
        expires: expiresOn,
      };
      const tokenObject = new RefreshToken(values);
      await tokenObject.save();
      return tokenObject;
    } catch (error) {
      throw createHttpError(500, 'Internal Server Error');
    }
  },
};

/**
 * @typedef RefreshToken
 */
const RefreshToken = mongoose.model('RefreshToken', refreshTokenSchema);
module.exports = RefreshToken;
