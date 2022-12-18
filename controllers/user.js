const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const DuplicateError = require('../errors/duplicate-error');

const { NODE_ENV, JWT_SECRET } = process.env;
const {
  JWT_SECRET_DEV,
  USER_ERROR_NOT_FOUND,
  USER_ERROR_DUPLICATE,
  USER_ERROR_UNAUTHORIZED,
  BAD_REQUEST_ERROR,
} = require('../utils/costants');

module.exports.getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => { throw new NotFoundError(USER_ERROR_NOT_FOUND); })
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR));
      } else { next(err); }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      email, password: hash, name,
    }))
    .then((user) => res.status(200).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new DuplicateError(USER_ERROR_DUPLICATE));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_ERROR));
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError(USER_ERROR_UNAUTHORIZED));
    });
};

module.exports.updateProfile = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFoundError(USER_ERROR_NOT_FOUND); })
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_ERROR));
      } else { next(err); }
    });
};
