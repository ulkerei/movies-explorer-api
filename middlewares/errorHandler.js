const { INTERNAL_SERVER_ERROR } = require('../utils/costants');

module.exports = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? INTERNAL_SERVER_ERROR : message,
  });
  next();
};
