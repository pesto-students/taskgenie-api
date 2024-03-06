const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/vars');

const verifyJWT = (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;
    const token = tokenString.split(' ')[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Authorization token is missing' });
    }
    const { sub } = jwt.verify(token, jwtSecret);
    req.user = sub;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  return null;
};

module.exports = verifyJWT;
