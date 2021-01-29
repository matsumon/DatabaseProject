const support = require('../support.js'); // import support functions

module.exports = function (app) {
    //#region main page GET Request Handler
    app.get('/', function (req, res) {
        res.status(200);
        var time = support.getBasicDate(); // Create time stamp for incident
        var response = "HTTP 200 - OK : PONG! - " + time;
        res.send(response);


        support.log("debug", "HTTP 200 - OK : PONG sent as a result of user request")
    });
    //#endregion
    //#region API interface JSON PUT handler
    app.post('/', function (req, res) {
        res.status(200);
        var time = support.getBasicDate(); // Create time stamp for incident
        var response = "HTTP 200 - OK : API REQUEST RECEIVED - " + time;
        res.send(response);


        support.log("debug", "HTTP 200 - OK : PONG sent as a result of user request")

    });
    //#endregion
    //#region API Handler
    app.post('/api', function (req, res) {
        support.log("debug", "API Request received, processing request...")

        // verify request has required properties for execution
        if (req.body.hasOwnProperty('username') &&
            req.body.hasOwnProperty('token') &&
            req.body.hasOwnProperty('operation_name') &&
            req.body.hasOwnProperty('task_data')) {

            if (req.body.operation_name == "Logon" &&
                req.body.token == null
            ) {
                // send stuff to logon handler w/ the req and res data


            } else if (req.body.token != null) {
                // verify username and token
                // send stuff to proper handler w/ req and res data


            } else {
                // handle properly structured api request missing mandatory information
                res.status(400);
                const response = `You have provided a improperly formatted request, request denied - Request Data : \n ${req.body}`
                res.send(response);
                support.log("debug", `HTTP 400 - BAD API REQUEST LOGGED - REQ BODY : \n ${req.body}`);

            }



        } else {

            //handle improperly structure api request information
            res.status(400);
            const response = `You have provided a improperly formatted request, request denied - Request Data : \n ${req.body}`
            res.send(response);
            support.log("debug", `HTTP 400 - BAD API REQUEST LOGGED - REQ BODY : \n ${req.body}`);
        }

    });

    //#endregion

}