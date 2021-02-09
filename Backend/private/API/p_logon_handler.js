//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('../Database/database_access.js');
const credential = require('../Database/p_credential');



// Declare a new Asynchronous function using promises
async function validate_user(package) {
    return new Promise((resolve, reject) => {
        // verify required properties are available in the call
        if (package.task_data.hasOwnProperty('password') && package.hasOwnProperty('username')) {
            support.log("debug", "p_logon_handler.js - validate_user : validating User...");

            // query the database for the hash of the user
            const user_hash_retrieval_query = `SELECT hash, exp_date, user_id
            FROM credential
            Where user_id in (SELECT id from user where username = "${package.username}");`
            db.promise_pool.query(user_hash_retrieval_query).then((rows) => {
                try {
                    // resolve returning the data package containing the details
                    const hash = rows[0][0].hash
                    const exp_date = rows[0][0].exp_date
                    const current_date = support.getBasicDate();
                    const user_id = rows[0][0].user_id;
                    
                    //verify hash and time exists
                    if ((hash != null) &&
                        (hash != "") &&
                        (exp_date != null) &&
                        (exp_date != "")) {

                        // verify credential has not expired
                        if (current_date < exp_date) {
                            support.log("debug", "p_logon_handler.js - validate_user : user has valid credential, testing password.")
                            // test password
                            const comparison_package = {
                                "password": package.task_data.password,
                                "hash": hash
                            }
                            credential.compare_password(comparison_package).then((r_msg) => {
                                // deal with password comparison result
                                if (r_msg.result) {

                                    support.log("debug", "p_logon_handler.js - validate_user : user has valid credential.")

                                    const r_msg = {
                                        "status": 1,
                                        "Message": "Password user is valid",
                                        "user_id" : `${user_id}`,
                                        "result": true
                                    };
                                    resolve(r_msg);

                                } else {
                                    const r_msg = {
                                        "status": 1,
                                        "Message": "Password user is invalid",
                                        "result": false
                                    };
                                    reject(r_msg);
                                }
                            }).catch((error) => {
                                support.log("error", `Unable to validate password : \n ${error}`);
                                const r_msg = {
                                    "status": 0,
                                    "Message": "Unable to validate password",
                                };
                                reject(r_msg);
                            })

                        }
                        // deal with expired credential
                        else {
                            support.log("error", `Unable to validate user, Their Credential has Expired ERROR : \n ${error}`);
                            const r_msg = {
                                "status": 1,
                                "Message": "User Found, but credential has expired",
                                "Result": false
                            };
                            reject(r_msg);
                        }
                    }
                    // deal with empty or incomplete sql response where required data for validation is missing
                    else {
                        support.log("error", `Unable to validate user, they Likely do NOT exist, ERROR : \n ${error}`);
                        const r_msg = {
                            "status": 0,
                            "Message": error
                        };
                        reject(r_msg);
                    }


                } catch {
                    support.log("error", `Unable to validate user, they Likely do NOT exist, ERROR : \n ${error}`);
                    const r_msg = {
                        "status": 0,
                        "Message": error
                    };
                    reject(r_msg);

                };

                // deal with db query failures
            }).catch((error) => {

                support.log("error", `Unable to validate user, db promise pool could not fulfill the query, ERROR : \n ${error}`);
                const r_msg = {
                    "status": 0,
                    "Message": error
                };

                // resolve returning the data package containing the details
                reject(r_msg);
            });


            // handle failure to provide suitable data package
        } else {
            support.log("debug", "p_logon_handler.js - validate_user : unable to validate user with incomplete data package.")

            const r_msg = {
                "status": 0,
                "Message": "Can NOT validate_user, insufficient information to preform request",
            };
            reject(r_msg);
        }

    });
};

async function validate_session(){
    // code to validate user sessions
};

//export required module components
module.exports.validate_user = validate_user;
module.exports.validate_session = validate_session;