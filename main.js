var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var app = express();
var port = 80;
var http = require('http').createServer(app);

var servercreator = require('./src/filmManager.js');

passport.use(new Strategy(
    function (username, password, cb) {
        db.users.findByUsername(username, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false); }
            if (user.password != password) { return cb(null, false); }
            return cb(null, user);
        });
    }
));
passport.serializeUser(function (user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
    db.users.findById(id, function (err, user) {
        if (err) { return cb(err); }
        cb(null, user);
    });
});

app.use(express.static(__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.render('index');
});
app.get('/register', function (req, res) {
    res.render('register');
});
app.get('/login', function (req, res) {
    res.render('login');
});
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/');
    }
);
app.get('/browse', function (req, res) {
    res.render('browse');
});
app.get('/play', function (req, res) {
    res.render('play');
});
app.get('/info', function (req, res) {
    res.render('info');
});
app.get('/logout', function (req, res) {
    res.render('logout');
});
// Port
app.listen(port);