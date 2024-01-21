const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../../models/user.model');
const { authSchema } = require('../../../../utils/validation_schema');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../../../../utils/jwt_util');
const passport = require('passport');
const controller = require('../../controllers/auth.controller')

router
    .route('/signup')
    .post(controller.signUp)


router
    .route('/signin')
    .post(controller.signIn)


router
    .route('/refresh-token')
    .post(controller.refreshToken)






router.delete('/logout', async (req, res, next) => {
    res.send("logout router");
});


router.get('/google', passport.authenticate('google', {
    scope: ['profile']
})
);

//callback route for google to redirect to
//the code that we got from redirect URI is sent to passport which gives us the profile info 
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
    // res.send('You have reached the callback URI'); //this means we are finally logged in[after all cookie thing is done]
    // res.send(req.user); // this req object has now all the info of user
    res.redirect('/profile/');
});



module.exports = router;
