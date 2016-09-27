
var router = express.Router();
var passport = require('./authenticationStrategies');

function ensureAuthenticated(req, res, next) {
    if(!req.isAuthenticated() || req.session.profile == undefined) {
        req.session.originalUrl = req.originalUrl;
        res.redirect('/login');
    } else {
        return next();
    }
}
// Universal logger for routes
router.use(function(req, res, next) {
    // log each request to the console
    console.log("From Router middleware: " + req.method + ", Router URL: " + req.url);
    // continue doing what we were doing and go to the route
    next();
});
// Facebook Router
router.get('/auth/facebook', passport.authenticate('facebook'));
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/success',
    failureRedirect: '/error'
}));
// Github Routes
router.get('/auth/github', passport.authenticate('github'));
router.get('/auth/github/callback', passport.authenticate('github', {
    successRedirect: '/success',
    failureRedirect: '/error'
}));
// Linkedin Routes
router.get('/auth/linkedin', passport.authenticate('linkedin'));
router.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
    successRedirect: '/success',
    failureRedirect: '/login'
}));
// Google routes
router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/success',
    failureRedirect: '/login'
}));
// Bluemix routes
router.get('/auth/bluemix', passport.authenticate('openidconnect', {}));
router.get('/auth/bluemix/callback', function(req, res, next) {
    passport.authenticate('openidconnect', {
        successRedirect: '/success',
        failureRedirect: '/error',
    })(req,res,next);
});
// Internal application routes
router.get('/home', function (req, res, next) {
    console.log('Redirect to HOME');
    res.sendfile('public/home.html');
});
router.get('/auth/login', function (req, res, next) {
    console.log('Redirect to LOGIN');
    res.sendfile('public/login.html');
});
router.get('/login', function (req, res, next) {
    console.log('Redirect to LOGIN');
    res.redirect(301, '/auth/bluemix');
    // res.sendfile('public/login.html');
});
router.get('/register', function (req, res, next) {
    console.log('Redirect to REGISTER');
    res.sendfile('public/register.html');
});
router.get('/channels', function (req, res, next) {
    console.log('Redirect to CHANNELS');
    res.sendfile('public/channels.html');
});
router.get('/tags', function (req, res, next) {
    console.log('Redirect to TAGS');
    res.sendfile('public/tags.html');
});
router.get('/success', function (req, res, next) {
    if(req.session != null) {
        console.log('Session information');
        console.dir(req.session);
    } else {
        console.log('SESSION is NULL');
    }

    // if(req.session.originalUrl != null) {
    //     console.log('Original URL is not null')
    //     console.dir(req.session.originalUrl);
    // } else {
    //     console.log('OriginalURL is NULL');
    // }
    res.redirect(302, 'home');
});
router.get('/error', function (req, res, next) {
    res.send("Error logging in.");
});
router.get('/', function (req, res, next) {
    res.sendfile('public/login.html');
});
router.get('/treeview', function (req, res, next) {
    res.sendfile('./public/mytreeview.html');
});

router.get('/home', function (req, res, next) {
    console.log('Redirect to HOME');
    res.sendfile('./public/home.html');
});

module.exports = router;