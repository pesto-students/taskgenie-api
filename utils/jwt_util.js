const JWT = require('jsonwebtoken');
const createError = require('http-errors');

//should use [return reject(error)], thought it won't affect the code but its good to exit function when promise has been rejected.

module.exports = {
    signAccessToken: (userId) =>{
        return new Promise((resolve, reject) =>{
            const payload = {
                
            }
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const options = {
                expiresIn: "1h",
                issuer: "taskgenie.com",               //////check this
                audience: userId,                     //who is getting the token
            }
            JWT.sign(payload , secret, options , (err, token) => {
                if(err){
                    console.log(err);
                    reject(createError.InternalServerError());
                    // reject(err);    we should never reject error like this as client has nothing to do with it. this is for our logs.s
                }
                    
                resolve(token);
            });
        });
        
    },
    verifyAccessToken: (req, res, next) => {
        if(!req.headers['authorization'])
            return next(createError.Unauthorized());

            const authHeader = req.headers['authorization'];
            const bearerToken = authHeader.split(' ');
            const token = bearerToken[1];
            JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, paylod) => {
                if(err){
                    const message = err.name === "JsonWebTokenError"? "Unauthorized" : err.message;
                    return next(createError.Unauthorized(message));
                }
                req.payload = paylod;
                next();
            })
    },
    signRefreshToken: (userId) =>{
        return new Promise((resolve, reject) =>{
            const payload = {
                
            }
            const secret = process.env.REFRESH_TOKEN_SECRET;
            const options = {
                expiresIn: "1y",
                issuer: "taskgenie.com",               //////check this
                audience: userId,                     //who is getting the token
            }
            JWT.sign(payload , secret, options , (err, token) => {
                if(err){
                    console.log(err);
                    reject(createError.InternalServerError());
                }
                    
                resolve(token);
            });
        });
        
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject)=>{
            JWT.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET, (err, paylod) => {
                if(err){
                    return reject(createError.Unauthorized());
                }
                const userId = paylod.aud;     //aud = audience in payload
                resolve(userId);           //what this does??
            })
        });
           
    }
}