const express = require('express');
// const { exists } = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Creating user model
const User = require('../models/User');

// To Login Page
router.get('/login', (req, res) => {
    res.render('login');
});

// To Register page
router.get('/register', (req, res) => {
    res.render('register');
});


// Register Handle part
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    // check requiring fields
    if(!name || !password || !password2){
        errors.push({ msg: 'Please fill-in all fields' });
    }
    // Checking password matching
    if(password !== password2){
        errors.push({ msg: 'Passwords not matched' });
    }

    // Checking password length
    if(password.length < 8){
        errors.push({ msg: 'Password should atleast 8 characters' });
    }

    // Checking the errors
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        // User Validation Passing
        User.findOne({ email: email}).then(user => {
            if(user) {
                // if user exists
                errors.push({ msg: 'This E-mail is already registered'});
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
                
            }
            else{
                const newUser = new User({
                    name,
                    email,
                    password
                });
                // Hash based PAsswords
                bcrypt.genSalt(10, (err, salt) => 
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        newUser.password = hash; // set password as hashed
                        newUser.save()  //save the user
                            .then(user => {
                                req.flash('success_msg', 'Successfully registered and log-in now');
                                res.redirect('login');
                            })
                            .catch(err => console.log(err));

                }))
            }
        })
    }

});

// Login Handle Local Stratagy
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
}); 


// For Logout Handle
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success_msg', 'You are Logged out...!');
    res.redirect('login');
});



module.exports = router;