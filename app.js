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
var router = require('./homeRouter');
var http = require('http');
var path = require('path');

// var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;

var BLUEMIX_CLIENT_CALLBACK_URL = 'auth/bluemix/callback';
var BLUEMIX_SSO_CALLBACK_URL = 'https://ssotest-wxgv4xup28-ct20.iam.ibmcloud.com/auth/bluemix/callback';
var services = JSON.parse(process.env.VCAP_SERVICES || null);

app.use('/', router);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
