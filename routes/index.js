const mainRouter = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const auth = require('../middlewares/auth');
const userRouter = require('./user');
const movieRouter = require('./movie');
const { login, createUser } = require('../controllers/user');
const NotFoundError = require('../errors/not-found-error');

mainRouter.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

mainRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

mainRouter.use(auth);
mainRouter.use('/users', userRouter);
mainRouter.use('/movies', movieRouter);
mainRouter.use('/', () => { throw new NotFoundError('Не туда зашли, батенька!'); });

module.exports = mainRouter;
