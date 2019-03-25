const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Producer = require('../models/producer.model');

passport.serializeUser((user, next) => {
 next(null, user.id)
});

passport.deserializeUser((id, next) => {
 Producer.findById(id)
 .then(producer => next(null, user))
 .catch(next)
});

passport.use('local-auth', new LocalStrategy({
 usernameField: 'email',
 passwordField: 'password'
}, (email, password, next) => {
 Producer.findOne({ email: email })
 .then(producer => {
   if (!producer) {
     next(null, false, 'Invalid email or password')
   } else {
     return user.checkPassword(password)
     .then(match => {
       if (!match){
         next(null, false, 'Invalid email or password')
       } else {
         next(null, producer)
       }
     })
   }

 })
}))