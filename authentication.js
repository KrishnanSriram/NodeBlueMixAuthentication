var session = require('express-session');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var cfenv = require('./cfenv-wrapper');
var appEnv = cfenv.getAppEnv();

module.exports = function() {
  return {
  	"setUp" : function(app, callback) {

      app.use(cookieParser());
      app.use(session({
        cookie: {
          maxAge: 1000 * 60 * 60 * 1 // 1 hour ?
        },
        resave: 'true',
        saveUninitialized: 'true',
        secret: 'top secr8t'
      }));

      app.use(passport.initialize());
      app.use(passport.session());

      passport.serializeUser(function(user, done) {
        done(null, user);
      });

      passport.deserializeUser(function(obj, done) {
        done(null, obj);
      });

      var ssoConfig = appEnv.getService(/sso.*/);
      if(ssoConfig != null) {
          console.log('SSOCONFIG is not NULL');
        var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
        var Strategy = new OpenIDConnectStrategy({
            authorizationURL : ssoConfig.credentials.authorizationEndpointUrl,
            tokenURL : ssoConfig.credentials.tokenEndpointUrl,
            clientID : ssoConfig.credentials.clientId,
            scope: 'openid',
            response_type: 'code',
            clientSecret : ssoConfig.credentials.secret,
            callbackURL : appEnv.url + '/auth/sso/callback',
            skipUserProfile: true,
            issuer: ssoConfig.credentials.issuerIdentifier},
            function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                console.log('PROFILE information');
                console.dir(profile);
                profile.accessToken = accessToken;
                profile.refreshToken = refreshToken;
                console.log('DONE function');
                console.dir(done)
                done(null, profile);
            })
            });

        passport.use(Strategy);
      } else {
          console.err('SSOCONFIG is NULL');
      }
      app.get('/login', passport.authenticate('openidconnect', {}));

      app.get('/auth/sso/callback',function(req,res,next) {
        var redirect_url = req.session.originalUrl;
        passport.authenticate('openidconnect',{
          successRedirect: redirect_url,
          failureRedirect: '/failure',
        })(req, res, next);
      });

      app.get('/failure', function(req, res) {
        res.send('Error: Login failed'); 
      });},
    "ensureAuthenticated" : function(req, res, next) {      
      var useBasicAuthorization = false;
      var authorizationHeader = req.headers['authorization'];
      if (authorizationHeader) {
        useBasicAuthorization = true;
      }
      if (useBasicAuthorization) {
        res.sendStatus(403);
        
        /*var user = auth(req);
        if (user.name == 'elusuario') { // tbd: remove hardcoded test case
          next();
        }
        else {
          res.sendStatus(403);
        }
        */
      } 
      else {
        if (!req.isAuthenticated()) {
          req.session.originalUrl = req.originalUrl;
          res.redirect('/login');
        } 
        else {
          next();
        }
      }
	  }
  };
};