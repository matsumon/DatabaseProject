const support = require('../support.js');               // bring in support functions
const logon = require('./p_logon_handler')              // bring in logon handler functions
const session = require('../Database/p_session')        // import session management handlers
const credential = require('../Database/p_credential')  // import credential management handlers
const user = require('../Database/p_user');             // import user management handlers
const role = require('../Database/p_role');             // import role_management handlers
const action = require('../Database/p_action')          // import action management
const { config } = require('winston');


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
            case 'LOGON':           // DONE
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
            case "ADD_SESSION":     // DONE
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
            case "ADD_CRED":        // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    credential.add_insecure_arbitrary_credential(json_api_request).then((r_msg)=> {
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
            case "UPDATE_CRED":     // DONE
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
            case "ADD_USR":         // DONE
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
            case "GET_USRS":        // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    user.get_users().then((r_msg) => {
                        // send required response w/ resulting user creation msg
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);

                    }).catch((error)=>{

                        // return error for bad user creation
                        support.log("Error", `route_api_ingest_support.js - Could not GET_USRS : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT GET_USRS : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
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
            case "GET_USRIDS":      // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    user.get_all_userid().then((r_msg) => {
                        // send required response w/ resulting user creation msg
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);

                    }).catch((error)=>{

                        // return error for bad user creation
                        support.log("Error", `route_api_ingest_support.js - Could not GET ALL USERS ID's: Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT GET ALL USERS ID's: API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
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
            case "ADD_ROLE":        // DONE
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
            case "GET_ROLEIDS":     // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    role.get_roleids().then(r_msg => {
                        // send required response w/ resulting new ROLE ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);


                    }).catch(error =>{
                        // return error for bad session creation
                        support.log("Error", `route_api_ingest_support.js - Could not GET_ROLEIDS : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT GET_ROLEIDS : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
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
            case "GET_SESSIONS":    // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    session.get_all_sessions().then(r_msg => {
                        // send required response w/ resulting new ROLE ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);


                    }).catch(error =>{
                        // return error for bad session creation
                        support.log("Error", `route_api_ingest_support.js - Could not GET_SESSIONS : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT GET_SESSIONS : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
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
            case "GET_CREDS":       // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    credential.get_all_credential().then(r_msg => {
                        // send required response w/ resulting new ROLE ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);


                    }).catch(error =>{
                        // return error for bad session creation
                        support.log("Error", `route_api_ingest_support.js - Could not GET_CREDS: Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT GET_CREDS : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
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
            case "ADD_ACTION":      // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    action.add_Action(json_api_request).then(r_msg => {
                        // send required response w/ resulting new ROLE ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);


                    }).catch(error =>{
                        // return error for bad session creation
                        support.log("Error", `route_api_ingest_support.js - Could not ADD_ACTION: Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT ADD_ACTION : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
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
            case "DEL_ACTION":      // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    action.del_Action(json_api_request).then(r_msg => {
                        // send required response w/ resulting new ROLE ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);


                    }).catch(error =>{
                        // return error for bad session creation
                        support.log("Error", `route_api_ingest_support.js - Could not del_ACTION: Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT del_ACTION : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
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
            case "UPDATE_ACTION":   // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    action.update_Action(json_api_request).then(r_msg => {
                        // send required response w/ resulting new ROLE ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);


                    }).catch(error =>{
                        // return error for bad session creation
                        support.log("Error", `route_api_ingest_support.js - Could not update_ACTION: Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT update_ACTION : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
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
            case "GET_ACTIONIDS":   // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    action.get_Action_ids().then(r_msg => {
                        // send required response w/ resulting new ROLE ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);


                    }).catch(error =>{
                        // return error for bad session creation
                        support.log("Error", `route_api_ingest_support.js - Could not GET_ROLEIDS : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT GET_ROLEIDS : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
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
            case "GET_ROLES":       // DONE
                logon.validate_session(json_api_request).then((r_msg) => { // session is valid
                    role.get_roles().then(r_msg => {
                        // send required response w/ resulting new ROLE ID
                        res.status(200);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `${JSON.stringify(r_msg)}`;
                        res.send(response);


                    }).catch(error =>{
                        // return error for bad session creation
                        support.log("Error", `route_api_ingest_support.js - Could not GET_ROLES : Unknown Error : \n ${error}`)
                        res.status(500);
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        res.setHeader('Access-Control-Allow-Headers', '*');
                        res.setHeader('Access-Control-Request-Method', '*');
                        const response = `HTTP 500 - CREDENTIALS VALIDATED - COULD NOT GET_ROLES : API REQUEST RECEIVED - ${support.getBasicDate()} \n ${JSON.stringify(json_api_request)}`;
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