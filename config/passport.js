const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require ('bcryptjs');

// Load all user models
const User = require('../models/User');

// Strategies
module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            // Match with exist Users
            User.findOne({ email: email })
                .then(user => {
                    if(!user){
                        return done(null, false, { message: 'This email is not registered!'});
                    }
                    // Match with Password
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if(err) throw err;
                        if(isMatch){
                            return done(null, user);
                        }
                        else{
                            return done(null, false, { message: 'password is Incorrect!' });
                        }
                    });
                })
                .catch(err => console.log(err));
        })
    );

    
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });

}