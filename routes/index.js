const express = require('express');

const router = express.Router();

const { ensureAuth } = require('../config/auth');

// The Welcome Page
router.get('/', (req, res) => {
    res.render('welcome');
});

// The Dashboard Page
router.get('/dashboard', ensureAuth, (req, res) => {
    res.render('dashboard', {
        name: req.user.name
    });
});

module.exports = router;