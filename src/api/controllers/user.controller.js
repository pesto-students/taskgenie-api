const createError = require("http-errors");
const httpStatus = require("http-status");
const User = require("../models/user.model");

exports.setupProfile = async (req, res, next) => {
	try {
		const { firstName, lastName, city } = req.body;
		const userId = req.user;
		console.log('update please',firstName, lastName, city)
		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{
				firstName,
				lastName,
				city,
				isProfileComplete: true,
			},
			{ new: true }
		);
		console.log('updated user', updatedUser)
		if (!updatedUser) {
			return next(createError(httpStatus.NOT_FOUND, "User not found"));
		}

		res.status(httpStatus.OK).json({
			message: "Profile setup successfully",
			// user: updatedUser,
		});
	} catch (error) {
		next(error);
	}
};

exports.getProfileStatus = async (req, res, next) => {
	const userId = req.user;
	console.log('get profile status', userId)
	try {
		const user = await User.findById(userId);
		if (!user) {
			return next(createError(httpStatus.NOT_FOUND, "User not found"));
		}
		// Return the profile status
		return res.status(200).json(user.isProfileComplete);
	} catch (error) {
		next(error);
	}
};

// exports.updateProfileStatus = async (req, res, next) => {
//   const userId = req.params.id;
//   // const userId = req.user.sub;
//   const { isProfileComplete } = req.body;

//   try {
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update the isProfileComplete field
//     user.isProfileComplete = isProfileComplete;
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
			return next(createError(httpStatus.NOT_FOUND, " User not found"));
		}
		res.status(httpStatus.OK).json(user);
	} catch (error) {
		next(error);
	}
};
exports.getUserNameById = async (req, res, next) => {
	try {
		const { userId } = req.params;
		console.log("userId", userId);
		const user = await User.findById(userId);
		console.log("user", user);
		if (!user) {
			return next(createError(httpStatus.NOT_FOUND, "User not found"));
		}
		res.status(httpStatus.OK).json(user.toObject().firstName);
	} catch (error) {
		next(error);
	}
};
