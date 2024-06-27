const httpStatus = require("http-status");
const moment = require("moment");
// @ts-ignore
const { omit } = require("lodash");
const User = require("../models/user.model");
const { jwtExpirationInterval } = require("../../config/vars");
const RefreshToken = require("../models/refreshToken.model");

// Generate token response containing access token and refresh token
function generateTokenResponse(user, accessToken) {
	const tokenType = "Bearer";
	// @ts-ignore
	const token = RefreshToken.generate(user).refreshToken;
	const expiresIn = moment().add(jwtExpirationInterval, "days");
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
		const { email } = req.body;
		// Check if user already exists with the given email
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			return res.status(httpStatus.UNAUTHORIZED).json({
				message: "Email already exists",
			});
		}

		// If user doesn't exist, proceed with creating a new user
		const userData = omit(req.body, "role");
		const user = new User(userData);
		await user.save();

		// Generate Token response containing access token and refresh token
		// @ts-ignore
		const token = generateTokenResponse(user, user.token());

		// Return the response with appropriate status code and JSON body
		res.status(httpStatus.CREATED).json({
			accessToken: token.accessToken,
			refreshToken: token.refreshToken,
			tokenType: "Bearer",
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
		next(error); // Pass other errors to the error handler middleware
	}
	return null;
}

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
async function signIn(req, res, next) {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(httpStatus.CONFLICT).json({
				status: "error",
				code: "email_does_not_exists",
				message: "Email doesn't exists",
			});
		}
		if (!user) {
			return res.status(httpStatus.UNAUTHORIZED).json({
				status: "error",
				code: "authentication_failed",
				message:
					"Authentication failed. User not found or invalid credentials.",
			});
		}
		// @ts-ignore
		const isPasswordMatch = await user.passwordMatches(password);
		if (!isPasswordMatch) {
			return res.status(httpStatus.UNAUTHORIZED).json({
				status: "error",
				code: "authentication_failed",
				message: "Authentication failed. Wrong credentials.",
			});
		}
		// @ts-ignore
		const accessToken = await user.token();
		const tokenResponse = generateTokenResponse(user, accessToken);
		return res.json({
			accessToken: tokenResponse.accessToken,
			refreshToken: tokenResponse.refreshToken,
			tokenType: "Bearer",
			expiresIn: tokenResponse.expiresIn,
			user: {
				email: user.email,
				role: user.role,
				id: user.id,
				isProfileComplete: user.isProfileComplete,
			},
		});
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
		// @ts-ignore
		const refreshObject = await RefreshToken.findOneAndRemove({
			userEmail: email,
			refreshToken: token,
		});
		// @ts-ignore
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
// TODO: logout and remove the refresh token from the database
// async function logout(req, res, next) {
//   try {
//     const { email, token } = req.body;
//     await RefreshToken.findOneAndRemove({
//       userEmail: email,
//       refreshToken: token,
//     });
//     return res.status(200).json({ message: 'logout successful' });
//   } catch (error) {
//     return next(error);
//   }
// }

module.exports = {
	signUp,
	signIn,
	refreshToken,
};
