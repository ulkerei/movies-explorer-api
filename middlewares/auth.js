const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET_DEV, AUTHORIZATION_ERROR } = require('../utils/costants');

module.exports = (req, res, next) => {
  const { authorization = '' } = req.headers;
  if (!authorization) {
    next(new UnauthorizedError(AUTHORIZATION_ERROR));
  } else {
    const token = authorization.replace(/^Bearer*\s*/i, '');
    try {
      const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV);
      req.user = { _id: payload._id };
      next();
    } catch (err) {
      next(new UnauthorizedError(AUTHORIZATION_ERROR));
    }
  }
};
