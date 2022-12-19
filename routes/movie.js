const movieRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovieList,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

movieRouter.get('/', getMovieList);

movieRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(/^https?:\/\/(w{3}\.)?[\w./-]+\.[\w./-]*(\/[\w._~:/?#[\]@!$&'()*+,;=-]*)?#?$/),
    thumbnail: Joi.string().required().pattern(/^https?:\/\/(w{3}\.)?[\w./-]+\.[\w./-]*(\/[\w._~:/?#[\]@!$&'()*+,;=-]*)?#?$/),
    trailerLink: Joi.string().required().pattern(/^https?:\/\/(w{3}\.)?[\w./-]+\.[\w./-]*(\/[\w._~:/?#[\]@!$&'()*+,;=-]*)?#?$/),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

movieRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex().length(24),
  }),
}), deleteMovie);

module.exports = movieRouter;
