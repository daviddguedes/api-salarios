const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
var ParseDashboard = require('parse-dashboard');

mongoose.connect('mongodb://<USER>:<PASSWORD>@ds131312.mlab.com:31312/jwt-api');

// const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
const databaseUri = "mongodb://<USER>:<PASSWORD>@ds131312.mlab.com:31312/jwt-api";

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'ESSE_APP_ID',
  masterKey: process.env.MASTER_KEY || 'ESSE_MASTER_KEY', 
  restAPIKey: process.env.REST_KEY || 'ESSE_REST_KEY', 
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/salarios', 
  liveQuery: {
    classNames: ["Posts", "Comments"] 
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

const index = require('./routes/index');
const users = require('./routes/users');
const apiSalarios = require('./routes/api');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/salarios';
app.use(mountPath, api);

const dashboard = new ParseDashboard({
  "apps": [
    {
      "serverURL": "http://localhost:1337/salarios",
      "appId": "ESSE_APP_ID",
      "masterKey": "ESSE_MASTER_KEY",
      "appName": "Api Salários"
    }
  ],
  "users": [
    {
      "user":"admin",
      "pass":"$2y$10$dXutbP8.XC0kzIUbBGzQDuSUrq.pX9DkfwI/ZCBwkYhoHxrG1.GzC"
    }
  ],
  "useEncryptedPasswords": true
});

// Parse Server plays nicely with the rest of your web routes
app.use('/', index);
app.use('/users', users);
app.use('/api', apiSalarios);
app.use('/dashboard', dashboard);

const port = process.env.PORT || 1337;
const httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('salarios api running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
