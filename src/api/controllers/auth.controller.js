const passport = require('passport')
const User = require('../models/user.model');
const { authSchema } = require('../../utils/validation_schema');
const { signAccessToken, signRefreshToken } = require('../../utils/jwt_util');
const createError = require('http-errors')

async function signUp(req, res, next) {
    try {
    //     validate signup body for email and password
        const result = await authSchema.validateAsync(req.body);

        //check if user exists
        const doesExist = await User.findOne({ email: result.email });
        // Inform that user already exists
        if (doesExist)
            throw createError.Conflict(`${result.email} already present`);

        //create user in database
        const user = new User(result);    
        await user.save();


        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({ accessToken, refreshToken });
    }
    catch (error) {
        //check if error is from joi
        if (error.isJoi === true)
            error.status = 422;
        next(error);
    }
}

async function signIn(req, res, next) {
    try {
        const result = await authSchema.validateAsync(req.body);


        const user = await User.findOne({ email: result.email });
        if (!user)
            throw createError.NotFound("User not registered");

        const isMatch = await user.isValidPassword(result.password);
        if (!isMatch)
            throw createError.Unauthorized("Username/password not valid");

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({ accessToken, refreshToken });
    }
    catch (error) {
        if (error.isJoi)
            return next(createError.BadRequest("Invalide username/password"));       //we are returning because we do not want next 'next'
        next(error);
    }
}

async function refreshToken(req, res, next) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken)
            throw createError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);

        const newAccessToken = await signAccessToken(user.id);
        const newRefreshToken = await signRefreshToken(user.id);

        res.send({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
    catch (error) {
        next(error);
    }
}

module.exports = {
    signUp,
    signIn,
    refreshToken,
}