const support = require('../support.js');   // bring in support functions
const logon = require('../API/p_logon_handler') // bring in logon handler functions

async function parse_http_JsonBody(req) {
    return new Promise((resolve, reject) => {
        try{
            // create body object 
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const json_body = JSON.parse(body);
            resolve(json_body);
        });
        }
        catch{
            support.log("error", "route_api_ingest_support.js - parse_http_JsonBody : Can NOT parse HTTP JSON BODY, unknown error");

            const r_msg = {
                "status": 0,
                "Message": "Can NOT parse HTTP JSON BODY, unknown error",
            };
            reject(r_msg);
        }


    });

};

async function evaluate_API_request(json_api_request){
    support.log("debug", `route_api_ingest_support.js - evaluate_API_request : Evaluating the API request for routing to proper functions : \n ${JSON.stringify(json_api_request)}`)
    return new Promise((resolve, reject) => {
        switch(json_api_request.operation_name){
            case 'LOGON':
                support.log("debug", `route_api_ingest_support.js - evaluate_API_request : LOGON REQUEST, Routing to Logon Handler`)
                // Send info to logon stuff
                logon.validate_user(json_api_request).then((r_msg)=>{
                    if()
                }).catch();


                break;

            default :
                support.log("Error", `route_api_ingest_support.js - evaluate_API_request : Unknown Request Type`)
                const r_msg = {
                    "status": 0,
                    "Message": "Unknown Request Type",
                };
                //reject(r_msg);

        }

        resolve();

    });
};

//export required module components
module.exports.parse_http_JsonBody = parse_http_JsonBody;
module.exports.evaluate_API_request = evaluate_API_request;
