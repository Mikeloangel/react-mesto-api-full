// general routes
// POST /signin log in system (usess http only cookie)
// POST /signup register to system
// GET /signout logs out from system, deletes cookie

const router = require('express').Router();
const { Joi, celebrate } = require('celebrate');
const { login, logout, createUser } = require('../controllers/users');

// signin / signup routes
router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

router.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(20),
      about: Joi.string().min(2).max(20),
      // eslint-disable-next-line
      avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&\/=]*)/).allow(''),
    }),
  }),
  createUser,
);

router.get('/signout', logout);

module.exports = router;
