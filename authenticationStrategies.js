var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var AppConstants = require('./constants');

var services = JSON.parse(process.env.VCAP_SERVICES || null);
var BASE_URL = '';

if(services == null) {
    BASE_URL = 'http://localhost:' + app.get('port') + '/';
    console.log("Running in a independent environment: " + BASE_URL);
} else {
    BASE_URL = 'https://krishnodejs.mybluemix.net/';
}

app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: AppConstants.FaceBook.appId,
    clientSecret: AppConstants.FaceBook.secretKey,
    callbackURL: BASE_URL + AppConstants.FaceBook.callbackURL
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        done(null, profile);
    });
}));

passport.use(new GitHubStrategy({
    clientID: AppConstants.Github.appId,
    clientSecret: AppConstants.Github.secretKey,
    callbackURL: BASE_URL + AppConstants.Github.callbackURL
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));

passport.use(new LinkedinStrategy({
    clientID: AppConstants.LinkedIn.appId,
    clientSecret: AppConstants.LinkedIn.secretKey,
    callbackURL: BASE_URL + AppConstants.LinkedIn.callbackURL,
    scope: ['r_emailaddress', 'r_basicprofile'],
}, function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}));

passport.use(new GoogleStrategy({
    clientID: AppConstants.Google.appId,
    clientSecret: AppConstants.Google.secretKey,
    callbackURL: BASE_URL + AppConstants.Google.callbackURL,

}, function (token, refreshToken, profile, done) {
    // make the code asynchronous
    process.nextTick(function () {
        // try to find the user based on their google id
        return done(null, profile);
    });

}));

if(services == null) {

} else {
    var ssoConfig = services.SingleSignOn[0];
    var client_id = ssoConfig.credentials.clientId;
    var client_secret = ssoConfig.credentials.secret;
    var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
    var token_url = ssoConfig.credentials.tokenEndpointUrl;
    var issuer_id = ssoConfig.credentials.issuerIdentifier;
    var callback_url = AppConstants.BlueMix.clientCallbackURL;
    console.log('ALL information about SSOCONFIG');
    console.dir(ssoConfig);

    var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
    var OpenIDStrategy = new OpenIDConnectStrategy({
        authorizationURL : authorization_url,
        tokenURL : token_url,
        clientID : client_id,
        scope: 'openid',
        response_type: 'code',
        clientSecret : client_secret,
        // callbackURL : callback_url,
        skipUserProfile: true,
        issuer: issuer_id
    }, function(accessToken, refreshToken, profile, done) {
        process.nextTick(function() {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            done(null, profile);
        });
    });
    passport.use(OpenIDStrategy);
}

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

module.exports = passport;