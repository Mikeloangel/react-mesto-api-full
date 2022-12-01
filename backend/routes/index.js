const router = require('express').Router();

// middleware auth
const { auth } = require('../middlewares/auth');

// all routes
const usersRoutes = require('./users');
const cardsRoutes = require('./cards');
const authRoutes = require('./auth');

const ResourceNotFoundError = require('../errors/not-found-error');

// unprotected routes
router.use('/', authRoutes);

router.use(auth);
// protected routes
router.use('/users', usersRoutes);
router.use('/cards', cardsRoutes);

// handle 404
router.all('*', (req, res, next) => {
  next(new ResourceNotFoundError());
});

module.exports = router;
