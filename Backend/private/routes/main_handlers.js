const support = require('../support.js');

module.exports = function(app){
    //#region main page GET Request Handler
    app.get('/',function(req,res){
        res.status(200);
        var time = support.getBasicDate(); // Create time stamp for incident
        var response = "HTTP 200 - OK : PONG! - " + time;
        res.send(response);
        
    });
    //#endregion
  
}