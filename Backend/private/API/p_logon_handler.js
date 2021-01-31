//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('../Database/database_access.js');
const credential = require('../Database/p_credential');



// Declare a new Asynchronous function using promises
async function validate_user(package) {
    if (package.task_data.hasOwnProperty('password') && package.hasOwnProperty('username')) {
        support.log("debug", "p_logon_handler.js - validate_user : validating User...");


        const user_hash_retrieval_query = `SELECT hash, exp_date
        FROM credential
        Where user_id in (SELECT id from user where username = "${package.username}");
        `
        db.promise_pool.query(user_hash_retrieval_query).then((rows) => {
            try {
                // resolve returning the data package containing the details
                const hash = rows[0][0].hash
                const exp_date = rows[0][0].exp_date
                const current_date = support.getBasicDate();

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
                            if (r_msg.result) {
                                support.log("debug", "p_logon_handler.js - validate_user : user has valid credential.")
                                const r_msg = {
                                    "status": 1,
                                    "Message": "Password user is valid",
                                    "result": true
                                };
                                return (r_msg);
                            } else {
                                const r_msg = {
                                    "status": 1,
                                    "Message": "Password user is invalid",
                                    "result": false
                                };
                                return (r_msg);
                            }
                        }).catch((error) => {
                            support.log("error", `Unable to validate password : \n ${error}`);
                            const r_msg = {
                                "status": 0,
                                "Message": "Unable to validate password",
                            };
                            return (r_msg);
                        })
                    } else {
                        support.log("error", `Unable to validate user, they Likely do NOT exist, ERROR : \n ${error}`);
                        const r_msg = {
                            "status": 1,
                            "Message": "User Found, but credential has expired",
                            "Result": false
                        };
                        return (r_msg);
                    }
                } else {
                    support.log("error", `Unable to validate user, they Likely do NOT exist, ERROR : \n ${error}`);
                    const r_msg = {
                        "status": 0,
                        "Message": error
                    };
                    return (r_msg);
                }


            } catch {
                support.log("error", `Unable to validate user, they Likely do NOT exist, ERROR : \n ${error}`);
                const r_msg = {
                    "status": 0,
                    "Message": error
                };
                return (r_msg);

            };


        }).catch((error) => {

            support.log("error", `Unable to validate user, db promise pool could not fulfill the query, ERROR : \n ${error}`);
            const r_msg = {
                "status": 0,
                "Message": error
            };

            // resolve returning the data package containing the details
            return (r_msg);
        });


    } else {
        support.log("debug", "p_logon_handler.js - validate_user : unable to validate user with incomplete data package.")

        const r_msg = {
            "status": 0,
            "Message": "Can NOT validate_user, insufficient information to preform request",
        };
        return (r_msg);
    }



};

//export required module components
module.exports.validate_user = validate_user;