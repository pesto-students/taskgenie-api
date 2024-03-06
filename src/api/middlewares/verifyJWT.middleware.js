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
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  return null;
};

module.exports = verifyJWT;
