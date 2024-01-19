const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const User = require('../../models/user.model');
const {authSchema} = require('../../../../utils/validation_schema');
const {signAccessToken, signRefreshToken, verifyRefreshToken} = require('../../../../utils/jwt_util');
const passport = require('passport');

router.post('/signup', async(req, res, next) => {
    // res.send("sign-up router");
    try{
        // const {email, password} = req.body;
        // if(!email || !password) throw createError.BadRequest();
        const result = await authSchema.validateAsync(req.body);

        //check if user exists
        const doesExist = await User.findOne({email: result.email});

        if(doesExist) 
            throw createError.Conflict(`${result.email} already present`);

        //create user in database
        const user = new User(result);    // new User({email: email, password: password});
        const savedUser = await user.save();
        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({accessToken, refreshToken});
    }
    catch(error){
        //check if error is from joi
        if(error.isJoi === true) 
            error.status = 422;
        next(error);
    }

});


//login route
router.post('/login', async(req, res, next) => {
    try{
        const result = await authSchema.validateAsync(req.body);


        const user = await User.findOne({email: result.email});
        if(!user)
            throw createError.NotFound("User not registered");

        const isMatch = await user.isValidPassword(result.password);
        if(!isMatch)
            throw createError.Unauthorized("Username/password not valid");

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({accessToken, refreshToken});
    }
    catch(error){
        if(error.isJoi)
            return  next(createError.BadRequest("Invalide username/password"));       //we are returning because we do not want next 'next'
        next(error);
    }
});



router.post('/refresh-token', async(req, res, next) => {
    try{
        const {refreshToken} = req.body;
        if(!refreshToken)
            throw createError.BadRequest();
        const userId = await verifyRefreshToken(refreshToken);

        const newAccessToken = await signAccessToken(user.id);
        const newRefreshToken = await signRefreshToken(user.id);

        res.send({accessToken: newAccessToken, refreshToken: newRefreshToken});
    }
    catch(error){
        next(error);
    }
});





router.delete('/logout', async(req, res, next) => {
    res.send("logout router");
});


router.get('/google', passport.authenticate('google', {
    scope: ['profile']
})
);

//callback route for google to redirect to
//the code that we got from redirect URI is sent to passport which gives us the profile info 
router.get('/google/redirect', passport.authenticate('google'), (req,res) =>{
    // res.send('You have reached the callback URI'); //this means we are finally logged in[after all cookie thing is done]
    // res.send(req.user); // this req object has now all the info of user
    res.redirect('/profile/');
});



module.exports = router;
