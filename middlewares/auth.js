const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization = '' } = req.headers;
  if (!authorization) {
    next(new UnauthorizedError('Необходима авторизация'));
  } else {
    const token = authorization.replace(/^Bearer*\s*/i, '');
    try {
      const payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : '970936da65e054506001c0ea55adf1dd7e098801094b3c11500b89bdfc1fb8ca');
      req.user = { _id: payload._id };
      next();
    } catch (err) {
      next(new UnauthorizedError('Необходима авторизация'));
    }
  }
};
