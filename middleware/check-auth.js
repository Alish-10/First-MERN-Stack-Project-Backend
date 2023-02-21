const HttpError = require("../models/http-error");
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

  try {
    const token = req.headers.authorization.split(' ')[1]; //authorization: 'bearer token'
    if (!token) {
      const error = new HttpError('Authentication failed!', 401);
      return next(error);
    }
    const decodedToken = jwt.verify(token, 'auth_token');
    req.userData = { userId: decodedToken.userId };
    next();

  } catch (err) {
    const error = new HttpError('Authentication failed!', 401);
    return next(error);
  }
}