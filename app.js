const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const mainRouter = require('./routes/index');

require('dotenv').config();

const limiter = rateLimit({
  windowsMs: 900000,
  max: 100
});

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/moviesdb');

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

app.use(requestLogger);
app.use(mainRouter);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
