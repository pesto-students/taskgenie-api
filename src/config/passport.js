const JwtStrategy = require('passport-jwt').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { ExtractJwt } = require('passport-jwt');
const { jwtSecret, google } = require('./vars');
// const authProviders = require('../api/services/authProviders');
const User = require('../api/models/user.model');

const jwtOptions = {
  secretOrKey: jwtSecret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
};

const googleOptions = {
  clientID: google.clientId,
  clientSecret: google.clientSecret,
  callbackURL: google.callbackURL,
};

const jwt = async (payload, done) => {
  try {
    const user = await User.findById(payload.sub);
    if (user) return done(null, user);
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
};

const googleCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if the user is already registered in your database
    let user = await User.findOne({ 'google.id': profile.id });

    if (user) {
      // If the user is found, return the user
      return done(null, user);
    }
    // If the user is not found, create a new user in your database
    user = new User({
      google: {
        id: profile.id,
        email: profile.emails[0].value,
        displayName: profile.displayName,
        // Add other relevant fields from the Google profile if needed
      },
    });

    // Save the new user to the database
    await user.save();

    // Return the newly created user
    return done(null, user);
  } catch (error) {
    return done(error);
  }
};
exports.jwt = new JwtStrategy(jwtOptions, jwt);
exports.google = new GoogleStrategy(googleOptions, googleCallback);
