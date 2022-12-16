const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const NotFoundError = require('../errors/not-found-error');
const DuplicateError = require('../errors/duplicate-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => { throw new NotFoundError(`Пользователь с id ${req.params.id} не найден.`); })
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный id пользователя.'));
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
        next(new DuplicateError('Пользователь с таким email уже существует.'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else { next(err); }
    });
};

module.exports.login = (req, res, next) => {
  const {
    email, password,
  } = req.body;
  Users.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : '970936da65e054506001c0ea55adf1dd7e098801094b3c11500b89bdfc1fb8ca', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Неправильное имя пользователя или пароль.'));
    });
};

module.exports.updateProfile = (req, res, next) => {
  const {
    name,
    about,
  } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => { throw new NotFoundError(`Пользователь с id ${req.params.id} не найден.`); })
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else { next(err); }
    });
};
