//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('../Database/database_access.js');
const crypto = require('crypto'); // import cryptographic support to allow us to generate fast HMACS for secure session tokens


//define required functions
async function create_session(package) {
    return new Promise((resolve, reject) => {
        support.log("debug", "p_session.js - create_session : Creating new session");

        // verify we are given required data to init a session

        if (package.hasOwnProperty('id')) {

            //Create a Session Token
            // note: session init components below are generated randomly on request, making the targeted generation of colliding tokens impossible
            const random_iv = crypto.randomBytes(25).toString('base64').slice(0, 25)        // generates a 25char length random IV for crypto.createHmac(sha256)
            const random_secret = crypto.randomBytes(60).toString('base64').slice(0,60);    // generates a 60char random secret for crypto.createHmac(sha256) 
            const time_secret_value = support.getBasicDate() + random_iv + random_secret;   // ties our random value generations to the time of request making
                                                                                            //      our token derivation time dependant and harder compute
            // generate our token from a SHA256 hash of the iv and secret
            const token = crypto.createHmac('sha256', random_iv)
                .update(time_secret_value)
                .digest('hex');

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
                    "Message": `Session successfully created for user_id ${package.user_id}`,
                    "insertId": rows[0].insertId
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
        if (package.hasOwnProperty('id') &&
            package.hasOwnProperty('email_addr')) {


        } else {
            // handle insufficient data to manage request error 
            const r_msg = {
                "status": 0,
                "Message": "Can NOT Update requested session, insufficient information to preform request",
            };
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



// export required functions
module.exports.create_session = create_session;
module.exports.update_session = update_session;
module.exports.remove_session = remove_session;
