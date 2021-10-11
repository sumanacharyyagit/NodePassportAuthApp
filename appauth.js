const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

const appauth = express();

appauth.use(express.static('public'));

// Passport Configuraton
require('./config/passport')(passport);

// DataBase Config
const db = require('./config/keys').MongoURI;

// Connection to Mongo
mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log('MongoDB Connected...!'))
.catch(err => console.log('err'));

// EJS MiddleWare
appauth.use(expressLayouts);
appauth.set('view engine', 'ejs');


//Body Parser
appauth.use(express.urlencoded({ extended: false })); 


// express session Middleware
appauth.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
    // cookie: { secure: true }
}));


// Passport Middleware (Require)
appauth.use(passport.initialize());
appauth.use(passport.session());


// Connect flash Middleware
appauth.use(flash());


// Global Variables
appauth.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});


// Routes folder
appauth.use('/', require('./routes/index'));
appauth.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 8080;

appauth.listen(PORT, console.log(`Port >> localhost:${PORT}`));
