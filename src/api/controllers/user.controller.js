const createError = require('http-errors');
const httpStatus = require('http-status');
const User = require('../models/user.model');
const Review = require('../models/review.model');

exports.setupProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, city } = req.body;
    const userId = req.user;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        city,
        isSetupProfileComplete: true,
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

exports.getProfileStatus = async (req, res, next) => {
  const userId = req.params.id;
  // const userId = req.user.sub;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(httpStatus.NOT_FOUND, 'User not found'));
    }

    // Return the profile status
    return res
      .status(200)
      .json({ isSetupProfileComplete: user.isSetupProfileComplete });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  
}

exports.getReviewsByType = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { userType } = req.query;

    // Validate type parameter
    if (!['taskGenie', 'poster'].includes(userType)) {
      return next(createError(httpStatus.NOT_FOUND, 'Invalid review type'));
    }

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find reviews by user ID and type
    const reviews = await Review.find({ submitterUserID: userId, userType });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};
