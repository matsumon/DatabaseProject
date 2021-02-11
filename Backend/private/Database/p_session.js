//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('./database_access.js');


//define required functions
async function create_session(package) {
    return new Promise((resolve, reject) => {
        support.log("debug", "p_session.js - create_session : Creating new session");

        // verify we are given required data to init a session

        if (package.hasOwnProperty('id')) {

            //Create a Session Token
            // note: session init components below are generated randomly on request, making the targeted generation of colliding tokens impossible
            
            const token = support.create_sessionToken();
            // Create the query string to generate the session

            const session_creation_query = `INSERT into ${config.db_rootDatabase}.session
            (user_id,
            token,
            exp_date,
            user_req_date,
            created_at
            )
            VALUES
            (${package.id},
            '${token}',
            CURRENT_TIMESTAMP + INTERVAL 15 MINUTE,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP)`

            // start a DB connection to run our creation query
            db.promise_pool.query(session_creation_query).then((rows)=>{
                support.log("debug", `p_session.js - create_session : Session Created - ID of new Object = ${rows[0].insertId}`);

                const r_msg = {
                    "status": 1,
                    "Message": `Session successfully created for user!`,
                    "token" : `${token}`
                };

                // resolve returning the data package containing the details
                resolve(r_msg);

            }).catch((error)=>{
                support.log("error", `p_session.js - create_session : unable to create session db pool failed to service the request: \n ${error}`);
                const r_msg = {
                    "status": 0,
                    "Message": "Can NOT create Session db pool unable to service request",
                    "error" : error
                };
                reject(r_msg);
            })

            // resolve promises and error conditions



        } else {
            // handle insufficient data to manage request error
            const r_msg = {
                "status": 0,
                "Message": "Can NOT Generate a session, insufficient information to preform request",
            };
            reject(r_msg);
        }
    });
};

async function update_session(package) {
    return new Promise((resolve, reject) => {
        support.log("debug", "p_session.js - update_session : updating session");

        // verify we have required data to manage the request
        if (package.hasOwnProperty('id')&&
            package.hasOwnProperty('exp_date')) {

                const update_session_query=`UPDATE ${config.db_rootDatabase}.session
                SET
                exp_date = "${package.exp_date}",
                WHERE
                id = ${package.id};`

                db.promise_pool.query(update_session_query).then(()=>{
                    support.log("debug", "p_credential.js - update_session : updated session")

                    const r_msg = {
                        "status": 1,
                        "Message": "Credential updated",
                    };

                    resolve(r_msg);


                }).catch((error)=>{
                    support.log("error", "p_session.js - update_session : Unable to update Session db.promise_pool failed to service the query")
                    const r_msg = {
                        "status": 0,
                        "Message": "Can NOT update session insufficient information to preform request",
                        "error" : error
                    };

                    reject(r_msg);
                })
        }else {
            // handle insufficient data to manage request error 
            const r_msg = {
                "status": 0,
                "Message": "Can NOT Update requested session, insufficient information to preform request"
            }

            reject(r_msg);

        }
    });
};

async function remove_session(session_id) {
    return new Promise((resolve, reject) => {
        support.log("error", `p_session.js - remove_session : removing session : ${session_id}`);
        // verify we have required data to manage the request
        if (session_id == "" || session_id == null) {


        } else {
            // handle insufficient data to manage request error
            const r_msg = {
                "status": 0,
                "Message": "Can NOT Remove the requested session, insufficient information to preform request",
            };
            reject(r_msg);
        }
    });
};

async function create_insecure_arbitrary_session(package){
    return new Promise((resolve, reject) => {
        support.log("debug", "p_session.js - create_insecure_arbitrary_session : Creating new session");

        // verify we are given required data to init a session

        if (package.hasOwnProperty('id')) {

            
            // Create the query string to generate the session

            const session_creation_query = `INSERT into ${config.db_rootDatabase}.session
            (user_id,
            token,
            exp_date,
            user_req_date,
            created_at
            )
            VALUES
            (${package.id},
            '${package.task_data.token}',
            '${package.task_data.exp_date}',
            '${package.task_data.user_req_date}',
            '${package.task_data.created_at}')`

            // start a DB connection to run our creation query
            db.promise_pool.query(session_creation_query).then((rows)=>{
                support.log("debug", `p_session.js - create_insecure_arbitrary_session : Session Created - ID of new Object = ${rows[0].insertId}`);

                const r_msg = {
                    "status": 1,
                    "Message": `Session successfully created for user!`,
                    "token" : `${token}`
                };

                // resolve returning the data package containing the details
                resolve(r_msg);

            }).catch((error)=>{
                support.log("error", `p_session.js - create_insecure_arbitrary_session : unable to create session db pool failed to service the request: \n ${error}`);
                const r_msg = {
                    "status": 0,
                    "Message": "Can NOT create Session db pool unable to service request",
                    "error" : error
                };
                reject(r_msg);
            })

            // resolve promises and error conditions

 

        } else {
            // handle insufficient data to manage request error
            const r_msg = {
                "status": 0,
                "Message": "Can NOT Generate a session, insufficient information to preform request",
            };
            reject(r_msg);
        }
    });
};


// export required functions
module.exports.create_session = create_session;
module.exports.update_session = update_session;
module.exports.remove_session = remove_session;
module.exports.create_insecure_arbitrary_session = create_insecure_arbitrary_session;
