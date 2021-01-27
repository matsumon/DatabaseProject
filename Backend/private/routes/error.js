const support = require('../support.js');

module.exports = function (app) {

    // CONFIGURE ERROR HANDLING ROUTES
    // HTTP 404 handler
    app.use(function (req, res) {
        res.status(404); // Set response Status Code
        res.send("404 - Item not Found");
    });

    // HTTP 500 handler
    app.use(function (err, req, res, next) {
        var time = support.getBasicDate(); // Create time stamp for incident
        var response = "500 - Server unable to process request at this time" + time;
        res.status(500);                   // Set Reply Status
        res.send(response);                // Send 500 Error

        support.log("debug", "HTTP 500 - ERROR sent, unable to service requested operation or other failure occurred");
    });
}