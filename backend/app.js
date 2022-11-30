require('dotenv').config();

const { PORT = 3100 } = process.env;

// libs
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');

// cors
const cors = require('cors');

// middlewares
const { auth } = require('./middlewares/auth');
const { handleErrors } = require('./middlewares/handleErrors');
const { errorLogger, requestLogger } = require('./middlewares/logger');

// routes
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const indexRoutes = require('./routes/index');

const ResourceNotFoundError = require('./errors/not-found-error');

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

const options = {
  origin: [
    'http://localhost:3000',
    'http://mestology.nomoredomains.club',
    'https://mestology.nomoredomains.club',
    // 'https://YOUR.github.io',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization', 'Accept', 'Access-Control-Allow-Headers', 'credentials', 'withCredentials'],
  credentials: true,
};

app.use('*', cors(options));

// cookie parser
app.use(cookieParser());

// body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// request logger
app.use(requestLogger);

// crash test
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// unprotected routes
app.use('/', indexRoutes);

app.use(auth);
// protected routes
app.use('/users', usersRoutes);
app.use('/cards', cardsRoutes);

// handle 404
app.all('*', (req, res, next) => {
  next(new ResourceNotFoundError());
});

// error logger
app.use(errorLogger);

// error handling
// celebrate validation errors
app.use(errors());
// centralized error handling
app.use(handleErrors);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started at port ${PORT}`);
  // eslint-disable-next-line no-console
  console.log('Welcome to Mesto backend API');
});
