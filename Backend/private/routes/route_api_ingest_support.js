const config = require('../../init_config.json');
const { promise_pool } = require('../Database/database_access');
const support = require('../support.js');

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
            support.log("error", "p_support.js - parse_http_JsonBody : Can NOT parse HTTP JSON BODY, unknown error");

            const r_msg = {
                "status": 0,
                "Message": "Can NOT parse HTTP JSON BODY, unknown error",
            };
            reject(r_msg);
        }


    });

}

async function evaluate_API_request(json_api_request){
    return new promise((resolve, reject) => {
        
        // look at operation_name field, test for required content for the given operation type.
        // send request data to proper support operation.
        
        
    });
    
}

//export required module components
module.exports.parse_http_JsonBody = parse_http_JsonBody;
module.exports.evaluate_API_request = evaluate_API_request;
