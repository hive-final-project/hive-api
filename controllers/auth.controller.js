const createError = require('http-errors');
const User = require('../models/user.model');
const passport = require('passport');

module.exports.register = (req, res, next) => {
    const { email } = req.body;
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          throw createError(409, 'User already registered')
        } else {
          return new User(req.body).save();
        }
      })
      .then(user => res.status(201).json(user))
      .catch(next);
};

module.exports.authenticate = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, message) => {
    if (error) {
      next(error);
    } else if (!user){
      throw createError(401, message);
    } else {
      req.login(user, error => {
        if (error) {
          next(error);
        } else res.status(201).json(user)
      })
    }
  })(req, res, next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user.id)
  .populate('products')
  .populate('orders')
  .then(user => {
    if (!user){
      throw createError(404, 'User not found');
    } else res.status(202).json(user)
  })
  .catch(next);
};

module.exports.editUser = (req, res, next) => {
  delete req.body.email;
  const user = req.user;
  
  Object.keys(req.body).forEach(prop => user[prop] = req.body[prop]);

  if (req.file) user.imageURL = req.file.secure_url;

  user.save()
    .then(user => res.status(202).json(user))
    .catch(next)
}

module.exports.logout = (req, res, next) => {
    req.logout();
    res.status(204).json();
};