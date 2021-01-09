//#region includes
const fs = require('fs'); // include support for file fs operations for https key read modes
const http = require('http'); // include support for http listeners
var express = require('express'); // include express utilities
const config = require('./init_config.json'); // include configuration file for future references
const support = require('./private/support.js'); // include support functions for logging and the like
//#endregion

support.log("debug", "SERVER PRE_INIT STARTED");
//#region App Configuration

// Express Config
support.log("debug", "PRE_INIT - Configuring Express");
var app = express(); // Set up Express
app.use(express.static('public')); // Enable a Static Resources Directory
require('./private/routes/main_handlers.js')(app); // include the Root Page Handlers
require('./private/routes/error.js')(app); // include the error page Handlers



// Express JSON Interpreter Config
var bodyParser = require('body-parser'); // Set up JSON Support
app.use(bodyParser.urlencoded({
    extended: false
})); // Enable Decode of URL Encoded Post Requests
app.use(bodyParser.json()); // Enable Decode of Body Encoded Post Requests


support.log("debug", "PRE_INIT - Configuring HTTP Server");
// Server listener Setup
var httpServer; // Create hook to append http server if used
//#endregion

//#region HTTP Server Pre Launch
support.log("debug", "PRE_INIT - Loading Express APP into HTTP Server Environment");
httpServer = http.createServer(app);


//#endregion

//#region Main Server Launch
support.log("debug", "INIT - LAUNCHING HTTP SERVER");
httpServer.listen(config.http_port);
//#endregion

support.log("info", "SERVER INITIALIZED");