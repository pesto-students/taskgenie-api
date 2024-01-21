const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const { jwtSecret, jwtExpirationInterval, jwtIssuer } = require('../config/vars')

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {
                audience: userId
            }
            const secret = jwtSecret;
            const options = {

                expiresIn: jwtExpirationInterval,
                issuer: jwtIssuer,
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err);
                    reject(createError.InternalServerError());
                }
                resolve(token);
            });
        });

    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers['authorization'])
            return next(createError.Unauthorized());

        const authHeader = req.headers['authorization'];
        const bearerToken = authHeader.split(' ');
        const token = bearerToken[1];
        JWT.verify(token, jwtSecret, (err, paylod) => {
            if (err) {
                const message = err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
                return next(createError.Unauthorized(message));
            }
            req.payload = paylod;
            next();
        })
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {

            }
            const secret = jwtSecret;
            const options = {
                expiresIn: jwtExpirationInterval,
                issuer: jwtIssuer,
                audience: userId,
            }
            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err);
                    reject(createError.InternalServerError());
                }

                resolve(token);
            });
        });

    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            JWT.verify(refreshToken, jwtSecret, (err, paylod) => {
                if (err) {
                    return reject(createError.Unauthorized());
                }
                const userId = paylod.aud;     //aud = audience in payload
                resolve(userId);           //what this does??
            })
        });

    }
}