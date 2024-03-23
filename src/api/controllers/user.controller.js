const createError = require('http-errors');
const httpStatus = require('http-status');
const User = require('../models/user.model');

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

// exports.updateProfileStatus = async (req, res, next) => {
//   const userId = req.params.id;
//   // const userId = req.user.sub;
//   const { isSetupProfileComplete } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update the isSetupProfileComplete field
//     user.isSetupProfileComplete = isSetupProfileComplete;
//     await user.save();

//     res.status(200).json({ message: 'User profile updated successfully' });
//   } catch (error) {
//     next(error);
//   }
// };

exports.getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(httpStatus.NOT_FOUND, ' User not found'));
    }
    res.status(httpStatus.OK).json(user);
  } catch (error) {
    next(error);
  }
};
exports.getUserNameById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return next(createError(httpStatus.NOT_FOUND, 'User not found'));
    }
    res.status(httpStatus.OK).json({ name: user.toObject().name });
  } catch (error) {
    next(error);
  }
};
``