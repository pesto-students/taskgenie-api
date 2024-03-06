const createError = require('http-errors');
const httpStatus = require('http-status');
const User = require('../models/user.model');

exports.setupProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, city } = req.body;
    const userId = req.user.sub;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        city,
      },
      { new: true },
    );

    if (!updatedUser) {
      return next(createError(httpStatus.NOT_FOUND, 'User not found'));
    }

    res
      .status(httpStatus.OK)
      .json({ message: 'Profile setup successfully', user: updatedUser });
  } catch (error) {
    next(error);
  }
};
