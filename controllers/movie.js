const Movies = require('../models/movie');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const NotFoundError = require('../errors/not-found-error');

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
        next(new BadRequestError('Переданы некорректные данные.'));
      } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movies.findById(req.params.movieId)
    .orFail(() => { throw new NotFoundError(`Киношка с id ${req.params.movieId} не найдена.`); })
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        throw new ForbiddenError('Нельзя удалить чужой любимый фильм!');
      }
      return Movies.findByIdAndRemove(req.params.movieId);
    })
    .then(() => res.status(200).send({ message: `Киношка с id ${req.params.movieId} успешно разлюблена! Скорбим!` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else { next(err); }
    });
};
