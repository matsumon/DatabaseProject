//#region includes
const fs = require('fs'); // include support for file fs operations for https key read modes
const http = require('http'); // include support for http listeners
const https = require('https') // include support for https listeners
var express = require('express'); // include express utilities
const config = require('./init_config.json') // include configuration file for future references

//#endregion

//#region App Configuration

// Express Config
var app = express(); // Set up Express
app.use(express.static('public')); // Enable a Static Resources Directory
require('./private/routes/main_handlers.js')(app); // include the Root Page Handlers
require('./private/routes/error.js')(app); // include the error page Handlers


// JSON Interpreter Config
var bodyParser = require('body-parser'); // Set up JSON Support
app.use(bodyParser.urlencoded({
    extended: false
})); // Enable Decode of URL Encoded Post Requests
app.use(bodyParser.json()); // Enable Decode of Body Encoded Post Requests

// Server listener Setup
var httpServer; // Create hook to append http server if used
//#endregion

//#region HTTP Server Pre Launch
httpServer = http.createServer(app);


//#endregion

//#region Main Server Launch
httpServer.listen(config.http_port);
//#endregion