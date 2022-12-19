const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const mainRouter = require('./routes/index');

require('dotenv').config();

const { MONGO_URL_DEV } = require('./utils/costants');

const { NODE_ENV, MONGO_URL } = process.env;
const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : MONGO_URL_DEV);

app.use(requestLogger);
app.use(limiter);
app.use(cors(
  {
    origin: ['http://localhost:3000', 'https://movielib.nomoredomains.club', 'http://movielib.nomoredomains.club'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.use(mainRouter);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
