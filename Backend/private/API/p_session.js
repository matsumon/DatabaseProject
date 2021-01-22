//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('../Database/database_access.js');
const crypto = require('crypto'); // import cryptographic support to allow us to generate fast HMACS for secure session tokens


//define required functions
async function create_session() {
    return new Promise((resolve, reject) => {
        support.log("error", "p_session.js - create_session : Creating new session");

        // verify we are given required data to init a session

        if (package.hasOwnProperty('id') &&
            package.hasOwnProperty('email_addr')) {

            //Create a Session Token

            // start by generating a string that links time w/ the user information
            const time_user_data = support.getBasicDate + package.id + package.email_addr;

            // use this time_user_data result to create a hexadecimal token for the user session
            const token = crypto.createHmac('sha256', config.Session_HMAC_Seed)
                .update(time_user_data)
                .digest('hex');

            // Create the query string to generate the session



            // start a DB connection to run our creation query

            // resolve promises and error conditions


            
        } else {
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
        support.log("error", "p_session.js - update_session : updating session");


    });
};

async function remove_session(session_id) {
    return new Promise((resolve, reject) => {
        support.log("error", "p_session.js - remove_session : removing session");


    });
};



// export required functions
module.exports.create_session = create_session;
module.exports.update_session = update_session;
module.exports.remove_session = remove_session;
