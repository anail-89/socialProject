var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Social Network' });
});
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Login' });
});
router.get('/register', function(req, res, next) {
    res.render('register', { title: 'Register' });
});
router.get('/home', function(req, res, next) {
    res.render('home', { title: 'Home page' });
});
router.get('/activate', function(req, res, next) {
    res.render('activate', { title: 'Activate Profile' });
});
router.get('/forgot-password', function(req, res, next) {
    res.render('forgot-password', { title: 'Forgot Password' });
});
router.get('/reset-password', function(req, res, next) {
    res.render('reset-password', { title: 'Reset Password' });
});

module.exports = router;