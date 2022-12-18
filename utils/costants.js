const MONGO_URL_DEV = 'mongodb://127.0.0.1:27017/moviesdb';
const JWT_SECRET_DEV = '970936da65e054506001c0ea55adf1dd7e098801094b3c11500b89bdfc1fb8ca';

const AUTHORIZATION_ERROR = 'Необходима авторизация';
const INTERNAL_SERVER_ERROR = 'На сервере произошла ошибка';
const USER_ERROR_NOT_FOUND = 'Пользователь с данным id не найден.';
const USER_ERROR_DUPLICATE = 'Пользователь с таким email уже существует.';
const USER_ERROR_UNAUTHORIZED = 'Неправильное имя пользователя или пароль.';
const BAD_REQUEST_ERROR = 'Переданы некорректные данные.';
const MOVIE_ERROR_NOT_FOUND = 'Киношка с таким id не найдена.';
const MOVIE_ERROR_FORBIDDEN = 'Нельзя удалить чужой любимый фильм!';
const MOVIE_DELETE_MESSAGE = 'Киношка успешно разлюблена! Скорбим!';

module.exports = {
  MONGO_URL_DEV,
  JWT_SECRET_DEV,
  INTERNAL_SERVER_ERROR,
  AUTHORIZATION_ERROR,
  USER_ERROR_NOT_FOUND,
  USER_ERROR_DUPLICATE,
  USER_ERROR_UNAUTHORIZED,
  BAD_REQUEST_ERROR,
  MOVIE_ERROR_NOT_FOUND,
  MOVIE_ERROR_FORBIDDEN,
  MOVIE_DELETE_MESSAGE,
};
