const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/user');

userRouter.get('/me', getCurrentUser);
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
  }),
}), updateProfile);

module.exports = userRouter;
