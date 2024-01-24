/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const CreateHttpError = require('http-errors');
const httpStatus = require('http-status');
const jsonwebtoken = require('jsonwebtoken');
const moment = require('moment');
const { jwtExpirationInterval, jwtSecret } = require('../../config/vars');
/**
 * User Roles
 */
const roles = ['user', 'admin'];

/**
 *  User Schema
 *  @private
 */
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 128,
    },
    services: {
      google: String,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    picture: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);
/**
 * Pre-save hooks
 * - validations
 *
 */
// Pre-save middleware to hash the password
UserSchema.pre('save', async function saveMiddleware(next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});
/**
 * Methods
 */

UserSchema.methods = {
  /**
   * Compare stored password with a given passwords
   * @param {String} password
   * @returns
   */
  async passwordMatches(password) {
    return bcrypt.compare(password, this.password);
  },
  /**
   * signs jwt token with given payload, for the current user
   */
  token() {
    const payload = {
      exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    // jwt.encode(payload, jwtSecret);
    return jsonwebtoken.sign(payload, jwtSecret);
  },
};

/**
 * Statics
 */

UserSchema.statics = {
  roles,
  /**
   *
   * @param {ObjectId} id The objectId of user.
   * @returns {Promise<User, HttpError>}
   */
  async get(id) {
    let user;
    // using mongoDB objectId as user userid
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await this.findById(id).exec();
    }
    if (user) {
      return user;
    }
    throw new CreateHttpError({
      message: 'User does not exist',
      status: httpStatus.NOT_FOUND,
    });
  },
  /**
   * Find user by email and tries to generate jwt token
   * @param {*} options
   * @returns {Promise<User, HttpError>}
   */
  async findAndGenerateToken(options) {
    // throw error if no email is provided
    const { email, password, refreshObject } = options;
    if (!email) {
      throw new Error({
        message: 'An email is required to generate access token',
      });
    }
    // eslint-disable-next-line no-use-before-define
    const user = await User.findOne({ email }).exec();
    const err = {
      status: httpStatus.UNAUTHORIZED,
      isPublic: true,
    };
    if (password) {
      // email and password are available
      if (user && user.passwordMatches(password)) {
        // generate a new jwt token and send
        return {
          user,
          accessToken: user.token(),
        };
      }
      err.message = 'Incorrect email or password';
    } else if (refreshObject && refreshObject.userEmail === email) {
      // if email is there and a valid refresh token is provided
      // generate a new access token and send
      if (moment(refreshObject.expires).isBefore()) {
        err.message = 'Invalid refresh token.';
      } else {
        return { user, accessToken: user.token() };
      }
    } else {
      err.message = 'Incorrect email or refreshToken';
    }
    throw new CreateHttpError(err);
  },
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
