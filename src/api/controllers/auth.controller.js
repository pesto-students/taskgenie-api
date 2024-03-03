const createError = require('http-errors');
const httpStatus = require('http-status');
const moment = require('moment');
const { omit } = require('lodash');
const User = require('../models/user.model');
const { jwtExpirationInterval } = require('../../config/vars');
const RefreshToken = require('../models/refreshToken.model');

// Generate token response containing access token and refresh token
function generateTokenResponse(user, accessToken) {
  const tokenType = 'Bearer';
  const token = RefreshToken.generate(user).refreshToken;
  const expiresIn = moment().add(jwtExpirationInterval, 'minutes');
  return {
    tokenType,
    accessToken,
    refreshToken: token,
    expiresIn,
  };
}
/**
 * Returns jwt token if registration was successful
 * @public
 */
async function signUp(req, res, next) {
  try {
    const userData = omit(req.body, 'role');

    // Create user in database
    const user = new User(userData);
    await user.save();

    // Generate Token response containing access token and refresh token
    const token = generateTokenResponse(user, user.token());

    // Return the response with appropriate status code and JSON body
    res.status(httpStatus.CREATED).json({
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      tokenType: 'Bearer',
      expiresIn: token.expiresIn,
      user: {
        email: user.email,
        role: user.role,
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    // Check if it is a MongoDB duplicate error
    if (error.code === 11000) {
      return next(createError.Conflict('Email already exists'));
    }
    next(error);
  }
}

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
async function signIn(req, res, next) {
  try {
    const { user, accessToken } = await User.findAndGenerateToken(req.body);
    const tokenResponse = generateTokenResponse(user, accessToken);
    return res.json({ tokenResponse, user });
  } catch (error) {
    return next(error);
  }
}

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
async function refreshToken(req, res, next) {
  try {
    const { email, token } = req.body;
    const refreshObject = await RefreshToken.findOneAndRemove({
      userEmail: email,
      refreshToken: token,
    });
    const { user, accessToken } = await User.findAndGenerateToken({
      email,
      refreshObject,
    });
    const response = generateTokenResponse(user, accessToken);
    return res.json(response);
  } catch (error) {
    return next(error);
  }
}
// logout and remove the refresh token from the database
async function logout(req, res, next) {
  try {
    const { email, token } = req.body;
    await RefreshToken.findOneAndRemove({
      userEmail: email,
      refreshToken: token,
    });
    return res.status(200).json({ message: 'logout successful' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  signUp,
  signIn,
  refreshToken,
};
