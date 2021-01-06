const support = require('../support.js');   // import support functions

module.exports = function(app){
    //#region main page GET Request Handler
    app.get('/',function(req,res){
        res.status(200);
        var time = support.getBasicDate(); // Create time stamp for incident
        var response = "HTTP 200 - OK : PONG! - " + time;
        res.send(response);

        
        support.log("debug", "HTTP 200 - OK : PONG sent as a result of user request")
    });
    //#endregion
    //#region API interface JSON PUT handler
    app.put('/', function(req, res){
        res.status(200);
        var time = support.getBasicDate(); // Create time stamp for incident
        var response = "HTTP 200 - OK : API REQUEST RECEIVED - " + time;
        res.send(response);


        support.log("debug", "HTTP 200 - OK : PONG sent as a result of user request")

    });
    //#endregion
  
}