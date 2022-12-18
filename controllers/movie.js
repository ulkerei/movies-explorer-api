const Movies = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

const {
  BAD_REQUEST_ERROR,
  MOVIE_ERROR_NOT_FOUND,
  MOVIE_ERROR_FORBIDDEN,
  MOVIE_DELETE_MESSAGE,
} = require('../utils/costants');

module.exports.getMovieList = (req, res, next) => {
  Movies.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    thumbnail,
    trailerLink,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movies.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    thumbnail,
    trailerLink,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(BAD_REQUEST_ERROR));
      } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .orFail(() => { throw new NotFoundError(MOVIE_ERROR_NOT_FOUND); })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(MOVIE_ERROR_FORBIDDEN);
      }
      return Movies.findByIdAndRemove(req.params.movieId);
    })
    .then(() => res.status(200).send({ message: MOVIE_DELETE_MESSAGE }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(BAD_REQUEST_ERROR));
      } else { next(err); }
    });
};
