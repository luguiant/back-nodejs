const { validationResult } = require('express-validator');

const config = require('../config/global.config');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

exports.signup = (req, res, next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      throw error;
    }

    const names = req.body.names;
    const lastnames = req.body.lastnames;
    const coin_favorite = req.body.coin_favorite;
    const username = req.body.username;
    const is_active = true;
    const password = req.body.password;

    bcrypt
    .hash(password, 12)
    .then(hashedPw => {
      const user = new User({
        names,
        lastnames,
        coin_favorite,
        password: hashedPw,
        username,
        is_active
      });
      return user.save();
    })
    .then(result => {
      res.status(201).json({ message: 'User created!', userId: result.secret });
    })
    .catch(err => {
      const error = new Error('User created failed.');
      error.statusCode = 422;
      error.data = error;
      throw error;
    });
};


exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ username })
    .then(user => {
      if (!user) {
        const error = new Error('El usuario no fue encontrado.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }
      const token = jwt.sign(
        {
          username: loadedUser.username,
          userId: loadedUser.secret.toString()
        },
        config.keyToken,
        { expiresIn: config.tokenTime }
      );
      res.status(200).json({ token: token, userId: loadedUser.secret.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};