module.exports = {
    ensureAuth: function(req, res, next) {
        if (req.isAuthenticated()) {
            //req.isAuthenticated() will return true if user is logged in
            return next();
        }
        else{
            req.flash('error_msg', 'Please LogIn to to proceed with dashboard');
            res.redirect('/users/login');
        }
    } //,
    // ensureAuth: function(req, res, next) {
    //     if (!req.isAuthenticated()) {
    //         return next();
    //     }
    //     res.redirect('/dashboard');      
    // }
}