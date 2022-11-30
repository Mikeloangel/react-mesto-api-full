const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const UserExistsError = require('../errors/user-exists-error');
const WrongDataError = require('../errors/wrong-data-error');
const ResourceNotFoundError = require('../errors/not-found-error');

// get all users from Db
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// get user by id from Db
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findOne({ _id: userId })
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      const responceError = {
        CastError: new WrongDataError(),
        DocumentNotFoundError: new ResourceNotFoundError(),
      };

      next(responceError[err.name] || err);
    });
};

// creates user in Db
module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      name, about, avatar, email, password: hashedPassword,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserExistsError());
        return;
      }
      if (err.name === 'ValidationError') {
        next(new WrongDataError());
      } else {
        next(err);
      }
    });
};

// patches user info {name, about}
module.exports.updateUserInfo = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError());
      } else {
        next(err);
      }
    });
};

// patches user avatar {avatar}
module.exports.updateUserAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError());
      } else {
        next(err);
      }
    });
};

// logs user in and sends JWT back
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  const { NODE_ENV, JWT_SECRET } = process.env;

  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV ? JWT_SECRET : 'dev',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });

      res.send({ message: 'ok' });
    })
    .catch((err) => {
      res.clearCookie('jwt');
      next(err);
    });
};

// logout controller
module.exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.send({ message: 'До новых встреч!' });
};

// gets current user info
module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
