const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  // -----> Obtain the token from the request header
  const token = req.header('x-auth-token');

  // -----> If token cannot be found throw error
  if (!token) {
    return res.status(401).json({ message: 'No token found. Access  denied' });
  }

  // -------> Verify token
  try {
    // -----> Upon successful verification, pull out the user from the token
    const verifiedToken = jwt.verify(token, config.get('jwtSecret'));
    req.user = verifiedToken.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token. Access  denied' });
  }
};
