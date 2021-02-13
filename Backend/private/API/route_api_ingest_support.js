const support = require('../support.js'); // bring in support functions
const logon = require('./p_logon_handler') // bring in logon handler functions
const session = require('../Database/p_session') // import session management handlers
const credential = require('../Database/p_credential') // import credential management handlers
const user = require('../Database/p_user'); // import user management handlers
const role = require('../Database/p_role') // import role_management handlers


async function parse_http_JsonBody(req) {
    return new Promise((resolve, reject) => {
        support.log("debug", `route_api_ingest_support.js - parse_http_jasonBody : RAW REQUEST : ${req}`)
        try {
            // create body object 
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try{
                    const json_body = JSON.parse(body);
                    resolve(json_body);
                }catch(e){
                    // capture json parse error
                    support.log("error", "route_api_ingest_support.js - parse_http_JsonBody : Can NOT parse HTTP JSON BODY, BODY NOT JSON");
                    const r_msg = {
                        "status": 0,
                        "Message": "Can NOT parse HTTP JSON BODY, BODY NOT JSON",
                    };
                    reject(r_msg);
                }
                
            });
        } catch(e){
            // catch all other errors
            support.log("error", "route_api_ingest_support.js - parse_http_JsonBody : Can NOT parse HTTP JSON BODY, unknown error");

            const r_msg = {
                "status": 0,
                "Message": "Can NOT parse HTTP JSON BODY, unknown error",
            };
            reject(r_msg);
        }


    });

};

async function evaluate_API_request(json_api_request, res) {
    support.log("debug", `route_api_ingest_support.js - evaluate_API_request : Evaluating the API request for routing to proper functions : \n ${JSON.stringify(json_api_request)}`)
    return new Promise((resolve, reject) => {
        switch (json_api_request.operation_name) {
            case 'LOGON':   // DONE
                support.log("debug", `route_api_ingest_support.js - evaluate_API_request : LOGON REQUEST, Routing to Logon Handler`)
                
                // Send info to logon stuff
                logon.validate_user(json_api_request).then((r_msg) => { // password matched

                    // try and generate new session token and deliver it
                    session.create_session({"id": `${r_msg.user_id}`}).then((r_msg)=>{

                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);

                    }).catch((error)=>{
                       support.log("Error", `route_api_ingest_support.js - Could not generate Session Token : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT GENERATED SESSION TOKEN: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                        res.send(response);

                    })

                    

                }).catch((error) => {   // password did not match or error occurred
                    res.status(403);
                    const response = `HTTP 403 - CREDENTIALS NOT VALIDATED: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                    res.send(response);

                });


                break;
            case "ADD_SESSION": // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    session.create_insecure_arbitrary_session(json_api_request).then((r_msg)=>{
                        // send required response w/ resulting session ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);

                    }).catch((error) =>{
                        // return error for bad session creation
                        support.log("Error", `route_api_ingest_support.js - Could not Add_Session : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT ADD_SESSION : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                        res.send(response);
                        
                    });

    

                }).catch((error) => {   // session is invalid or error occurred
                    res.status(403);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Headers', '*');
                    res.setHeader('Access-Control-Request-Method', '*');
                    const response = `HTTP 403 - SESSION NOT VALID: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                    res.send(response);
                
                });
                break;
            case "ADD_CRED":    // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    credential.create_credential().then((r_msg)=> {
                        // send required response w/ resulting credential ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);

                    }).catch((error)=>{
                        // return error for bad session
                        support.log("Error", `route_api_ingest_support.js - Could not ADD_CRED : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT ADD_CRED: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                        res.send(response);
                        
                    })
    

                }).catch((error) => {   // session is invalid or error occurred
                    res.status(403);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Headers', '*');
                    res.setHeader('Access-Control-Request-Method', '*');
                    const response = `HTTP 403 - SESSION NOT VALID: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                    res.send(response);
                
                });
                break;
            case "UPDATE_CRED": // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    credential.update_credential(json_api_request.task_data).then((r_msg)=>
                    {
                        // send required response w/ resulting cred update msg
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);

                    }).catch((error)=>{
                        // return error for bad session
                        support.log("Error", `route_api_ingest_support.js - Could not UPDATE_CRED : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT UPDATE_CRED: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                        res.send(response);


                    })

    

                }).catch((error) => {   // session is invalid or error occurred
                    res.status(403);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Headers', '*');
                    res.setHeader('Access-Control-Request-Method', '*');
                    const response = `HTTP 403 - SESSION NOT VALID: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                    res.send(response);
                
                });
                break;
            case "ADD_USR": // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    user.create_user(json_api_request.task_data).then((r_msg) => {
                        // send required response w/ resulting user creation msg
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);

                    }).catch((error)=>{

                        // return error for bad user creation
                        support.log("Error", `route_api_ingest_support.js - Could not ADD_USR : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT ADD_USR: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                        res.send(response);

                    })
    

                }).catch((error) => {   // session is invalid or error occurred
                    res.status(403);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Headers', '*');
                    res.setHeader('Access-Control-Request-Method', '*');
                    const response = `HTTP 403 - SESSION NOT VALID: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                    res.send(response);
                
                });
                break;

            case "ADD_ROLE": // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    role.new_role(json_api_request).then(r_msg => {
                        // send required response w/ resulting new ROLE ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);


                    }).catch(error =>{
                        // return error for bad session creation
                        support.log("Error", `route_api_ingest_support.js - Could not ADD_ROLE : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT ADD_ROLE : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                        res.send(response);

                    })

    

                }).catch((error) => {   // session is invalid or error occurred
                    res.status(403);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Headers', '*');
                    res.setHeader('Access-Control-Request-Method', '*');
                    const response = `HTTP 403 - SESSION NOT VALID: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                    res.send(response);
                
                });
                break;
              
            
            // Deal with BAD API requests

            default:

                res.status(400);
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', '*');
                res.setHeader('Access-Control-Request-Method', '*');
                const response = `HTTP 400 - API REQUEST RECEIVED, HOWEVER REQUESTED ACTION IS NOT SUPPORTED OR UNDERSTOOD BY THE SERVER- ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
                res.send(response);


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
