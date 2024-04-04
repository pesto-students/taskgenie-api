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
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    choice: {
      type: String,
      enum: ['post-task', 'find-task'],
    },
    isSetupProfileComplete: {
      type: Boolean,
      default: false,
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
  },
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
      exp: moment().add(jwtExpirationInterval, 'days').unix(),
      iat: moment().unix(),
      sub: this._id,
    };
    const jwtToken = jsonwebtoken.sign(payload, jwtSecret);
    return jwtToken;
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
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
