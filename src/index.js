const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const app = require('./config/express');
const mongoose = require('./config/mongoose');
const express = require('express');
const morgan = require('morgan');
const createError = require('http-errors');
require('dotenv').config();
// require('./db/init_mongodb');
const AuthRoute = require('./api/routes/v1/auth.route');
const {verifyAccessToken} = require('../utils/jwt_util');
const passport = require('passport');
// const profileRoutes = require('./routes/profile-routes');
// const passportSetup = require('./config/passport-setup');




const PORT = process.env.PORT || 3000;


//initialize passport
app.use(passport.initialize());
app.use(passport.session());



app.get('/', verifyAccessToken, async (req, res, next) => {
    res.render('home', {user: req.user});
});

//for Routes
app.use('/auth', AuthRoute);
// app.use('/profile', profileRoutes);

// //to handle error
app.use(async (req , res, next) => {
//     // const error =  new Error('not found');
//     // error.status = 404;
//     // next(error);

    next(createError.NotFound('NotFound (from http-error package)'));
});

app.use((err, req, res , next) =>{
    res.status(err.status || 500) ; // 500 = internal server error
    res.send({
        error: {
            status : err.status || 500,
            message : err.message,
        }
    })
})

// open mongoose connection
mongoose.connect();

// Listen to requests
app.listen(port, () => {
  logger.info(`server startged on port ${port} ${env} `);
});

/**
 *  Exports express
 * @public
 */
module.exports = app;
