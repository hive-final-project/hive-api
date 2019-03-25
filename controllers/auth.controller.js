const createError = require('http-errors');
const User = require('../models/user.model');
const Producer = require('../models/producer.model');
const passport = require('passport');

module.exports.registerUser = (req, res, next) => {
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

module.exports.registerProducer = (req, res, next) => {
    const { email } = req.body;
    Producer.findOne({ email: email })
      .then(producer => {
        if (producer) {
          throw createError(409, 'Producer already registered')
        } else {
          return new Producer(req.body).save();
        }
      })
      .then(producer => res.status(201).json(producer))
      .catch(next);
};

module.exports.authenticateUser = (req, res, next) => {
  
};

module.exports.authenticateProducer = (req, res, next) => {

};

module.exports.logout = (req, res, next) => {
    req.logout();
    res.status(204).json();
};