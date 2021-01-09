// this is a attempt ot implement the credential handling exclusively though promises with out fucking it up

//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const bcrypt = require('bcrypt');
const db = require('../Database/database_access.js');

// Declare a new Asynchronous function using promises
async function async_set_password(package) {
    // prepare to return a promise when our function is called
    return new Promise((resolve, reject) => {
        // verify supplied object is suitable to execute requested operation
        if (package.hasOwnProperty('password') && package.hasOwnProperty('user_id')) {
            support.log("debug", `p_credential.js - async_set_password : Setting Password for user_id : ${package.user_id}`);

            // Hash the password
            bcrypt.hash(package.password, config.bcrypt_rounds).then(hash => {
                // lets build our query
                const query = `UPDATE ${config.db_rootDatabase}.credential
                    SET
                    hash = "${hash}"
                    WHERE
                    id = ${package.user_id};`

                db.promise_pool.query(query).then(() => {
                    support.log("debug", `p_credential.js - async_set_password : Password for user_id : ${package.user_id} was set`);

                    //set our resolve data for return
                    const r_msg = {
                        "status": 1,
                        "Message": `Password successfully set for user_id ${package.user_id}`

                    };

                    // resolve our promise
                    resolve(r_msg);

                }).catch((error) => {
                    // our query failed, log the incident
                    support.log("error", "p_credential.js - async_set_password : Unable to Set Password db.promise_pool failed to service the query")

                    // reject our promise, promoting the application pools failure as needed.
                    reject(error);
                })

            }).catch((error) => {
                support.log("error", "p_credential.js - async_set_password : Unable to Set Password bcrypt failed to hash password");
                support.log("error", error);
                reject("Unable to Set Password, bcrypt failed to hash password");
            });

        }
        //abort operation if supplied object is unsuitable
        else {
            support.log("error", "p_credential.js - async_set_password : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");

        }
    });

};

async function async_compare_password(package) {
    return new Promise((resolve, reject) => {
        // verify we were provided a suitable object
        if (package.hasOwnProperty('password') && package.hasOwnProperty('user_id')) {
            support.log("debug", `p_credential.js - async_compare_password : Comparing provided password for user_id : ${package.user_id}`);

            // retrieve password hash for comparison
            const hash_retrieval_query = `SELECT hash
            FROM ${config.db_rootDatabase}.credential
            WHERE id = ${package.user_id};`

            // ask the database for the credentials stored hash
            db.promise_pool.query(hash_retrieval_query).then((rows) => {
                //save the result
                const stored_hash = rows[0][0].hash;

                //ask bcrypt if we got the right password
                bcrypt.compare(package.password, stored_hash).then((result) => {
                    // handle the two conditions of the comparison
                    if (result == true) {
                        support.log("debug", "p_credential.js - async_compare_password : Password Comparison Operation Successful - MATCH ")
                        resolve(true);
                    } else {
                        support.log("debug", "p_credential.js - async_compare_password : Password Comparison Operation Successful - DOES NOT MATCH")
                        resolve(false);
                    }

                }).catch((error) => {
                    // our comparison failed, log the incident
                    support.log("error", "p_credential.js - async_compare_password : Unable to compare Password bcrypt failed to service the operation")
                    // reject our promise, promoting the application pools failure as needed.
                    reject(error);

                })
            }).catch((error) => {
                // our query failed, log the incident
                support.log("error", "p_credential.js - async_compare_password : Unable to compare Password db.promise_pool failed to service the query")
                // reject our promise, promoting the application pools failure as needed.
                reject(error);

            })

        }
        //abort operation if not provided suitable object
        else {
            support.log("error", "p_credential.js - async_compare_password : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }

    });
};

//export required module components
module.exports.async_set_password = async_set_password;
module.exports.async_compare_password = async_compare_password;