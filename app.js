/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

/**
 * Module dependencies.
 */
express = require('express');
app = express();
app.set('port', process.env.PORT || 3000);
// var router = require('./homeRouter');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var authenticationUtils = require('./authentication.js');
var services = JSON.parse(process.env.VCAP_SERVICES || null);

// app.use('/', router);

app.use(bodyParser.json());

authenticationUtils().setUp(app, function(err) {
  if (!err) {
    console.log('All is well. Setup executed successfully');
  } else {
    console.err('ERROR: authenticationUtils failed to SETUP');
  }
});

app.get('/', function(req, res, next) {
  res.send('Hello World');
});

app.get('/home', function (req, res, next) {
    console.log('Redirect to HOME');
    res.sendfile('public/home.html');
    });
    app.get('/auth/login', function (req, res, next) {
        console.log('Redirect to LOGIN');
        res.sendfile('public/login.html');
    });
    app.get('/register', function (req, res, next) {
        console.log('Redirect to REGISTER');
        res.sendfile('public/register.html');
    });
    app.get('/channels', authenticationUtils().ensureAuthenticated, function (req, res, next) {
        console.log('Redirect to CHANNELS - Updated');
        console.log('Begin Request object');
        // console.dir(req.user);
        console.log('END Request');
    
        res.sendfile('public/channels.html');
    });
    app.get('/tags', authenticationUtils().ensureAuthenticated, function (req, res, next) {
        console.log('Redirect to TAGS');
        res.sendfile('public/tags.html');
    });
    app.get('/logout', function(req, res, next) {
      req.logout();
      res.redirect('/');
    });

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
