// this is a attempt ot implement the credential handling exclusively though promises with out fucking it up

//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const bcrypt = require('bcrypt');
const db = require('./database_access.js');

// Declare a new Asynchronous function using promises
async function set_password(package) {
    // prepare to return a promise when our function is called
    return new Promise((resolve, reject) => {
        // verify supplied object is suitable to execute requested operation
        if (package.hasOwnProperty('password') && package.hasOwnProperty('user_id')) {
            support.log("debug", `p_credential.js - set_password : Setting Password for user_id : ${package.user_id}`);

            // Hash the password
            bcrypt.hash(package.password, config.bcrypt_rounds).then(hash => {
                // lets build our query
                const query = `UPDATE ${config.db_rootDatabase}.credential
                    SET
                    hash = "${hash}"
                    WHERE
                    id = ${package.user_id};`

                db.promise_pool.query(query).then(() => {
                    support.log("debug", `p_credential.js - set_password : Password for user_id : ${package.user_id} was set`);

                    //set our resolve data for return
                    const r_msg = {
                        "status": 1,
                        "Message": `Password successfully set for user_id ${package.user_id}`

                    };

                    // resolve our promise
                    resolve(r_msg);

                }).catch((error) => {
                    // our query failed, log the incident
                    support.log("error", "p_credential.js - set_password : Unable to Set Password db.promise_pool failed to service the query")

                    // reject our promise, promoting the application pools failure as needed.
                    reject(error);
                })

            }).catch((error) => {
                support.log("error", "p_credential.js - set_password : Unable to Set Password bcrypt failed to hash password");
                support.log("error", error);
                reject("Unable to Set Password, bcrypt failed to hash password");
            });

        }
        //abort operation if supplied object is unsuitable
        else {
            support.log("error", "p_credential.js - set_password : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");

        }
    });

};

async function compare_password(package) {
    return new Promise((resolve, reject) => {
        // verify we were provided a suitable object
        if (package.hasOwnProperty('password') && package.hasOwnProperty('hash')) {
            support.log("debug", `p_credential.js - compare_password : Comparing provided hash ${package.hash}`);
            bcrypt.compare(package.password, package.hash).then((result) => {
                // handle the two conditions of the comparison
                if (result == true) {
                    support.log("debug", "p_credential.js - compare_password : Password Comparison Operation Successful - MATCH ");

                    const r_msg = {
                        "status": 1,
                        "Message": `Password MATCHES provided hash`,
                        "result": true
                    };

                    resolve(r_msg);
                } else {
                    support.log("debug", "p_credential.js - compare_password : Password Comparison Operation Successful - DOES NOT MATCH");
                    const r_msg = {
                        "status": 1,
                        "Message": `Password successfully set for user_id ${package.user_id}`,
                        "result": false
                    };

                    resolve(r_msg);
                }

            }).catch((error) => {
                // our comparison failed, log the incident
                support.log("error", "p_credential.js - compare_password : Unable to compare Password bcrypt failed to service the operation")
                // reject our promise, promoting the application pools failure as needed.
                reject(error);

            })

        }
        //abort operation if not provided suitable object
        else {
            support.log("error", "p_credential.js - compare_password : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }

    });
};

async function create_credential() {
    // this will create a new credential, however you will still need to set the password after credential creation
    return new Promise((resolve, reject) => {
        support.log("debug", "p_credential.js - create_credential : Creating new Credential");
        // first build a query that will create a new credential object and return the PK field 'id' from its creation
        const credential_creation_query = `INSERT into ${config.db_rootDatabase}.credential
        (hash,
        exp_date,
        created_date,
        enabled)
        VALUES('', CURRENT_TIMESTAMP + INTERVAL 1 YEAR, CURRENT_TIMESTAMP, 1);`
        db.promise_pool.query(credential_creation_query).then((rows) => {
            support.log("debug", `p_credential.js - create_credential : Credential Created - ID of new Object = ${rows[0].insertId}`);

            const r_msg = {
                "status": 1,
                "Message": `Password successfully set for user_id ${package.user_id}`,
                "insertId": rows[0].insertId
            };

            // resolve returning the data package containing the details
            resolve(r_msg);


        }).catch((error) => {
            // our query failed, log the incident
            support.log("error", "p_credential.js - create_credential : Unable to create new Credential db.promise_pool failed to service the query")
            // reject our promise, promoting the application pools failure as needed.
            reject(error);
        })
    });
};

async function remove_credential(credential_id) {
    return new Promise((resolve, reject) => {
        support.log("debug", `p_credential.js - remove_credential : Removing Credential id ${credential_id}`);

        const credential_removal_query = `DELETE from ${config.db_rootDatabase}.credential
        WHERE id = ${credential_id}`

        db.promise_pool.query(credential_removal_query).then(() => {
            support.log('debug', `p_credential.js - remove_credential : credential ${credential_id} removed.`);

            const r_msg = {
                "status": 1,
                "Message": `Credential successfully removed for cred_id ${credential_id}`,
                "RemovedId": credential_id
            };

            resolve(r_msg);


        }).catch((error) => {
            support.log("error", "p_credential.js - remove_credential : Unable to remove Credential db.promise_pool failed to service the query")

            reject(error);

        })

    });
};

async function update_credential(package) {
    return new Promise((resolve, reject) => {

        if (package.hasOwnProperty('id') &&
            package.hasOwnProperty('exp_date') &&
            package.hasOwnProperty('enabled')) {
                support.log("debug", `p_credential.js - update_credential : Updating Credential id ${package.id}`);

                const update_credential_query = `UPDATE ${config.db_rootDatabase}.credential
                SET
                exp_date = "${package.exp_date}",
                enabled = "${package.enabled}"
                WHERE
                id = ${package.id};`

                db.promise_pool.query(update_credential_query).then(()=>{
                    support.log("debug", "p_credential.js - update_credential : updated Credential")

                    const r_msg = {
                        "status": 1,
                        "Message": "Credential updated",
                    };

                    resolve(r_msg);


                }).catch((error)=>{
                    support.log("error", "p_credential.js - update_credential : Unable to update Credential db.promise_pool failed to service the query")
                    const r_msg = {
                        "status": 0,
                        "Message": "Can NOT update credential insufficient information to preform request",
                        "error" : error
                    };

                    reject(r_msg);

                })


        } else {
            const r_msg = {
                "status": 0,
                "Message": "Can NOT update credential, insufficient information to preform request",
            };
            reject(r_msg);
        }


    });
}

async function get_all_credential(){
    return new Promise((resolve, reject )=>{
        support.log("debug", "p_credential.js - get_all_credential: retrieving credentials");

        const get_all_credentials_query =`SELECT * FROM ${config.db_rootDatabase}.credential`

        db.promise_pool.query(get_all_credentials_query).then((rows) =>{

            support.log("debug", `p_credential.js - get_all_credential: Retrieved ALL credentials`);
            const r_msg = {
                "status": 1,
                "Message": `credentials Successfully Retrieved`,
                "Results": rows[0]
            };
            // resolve returning the data package containing the details
            resolve(r_msg);

        }).catch((error)=>{
            support.log("error", `p_credential.js - get_all_credential: unable to create session db pool failed to service the request: \n ${error}`);
                const r_msg = {
                    "status": 0,
                    "Message": "Can NOT get all credentials, db pool unable to service request",
                    "error" : error
                };
                reject(r_msg);
        })
    })

}

//export required module components
module.exports.set_password = set_password;
module.exports.compare_password = compare_password;
module.exports.create_credential = create_credential;
module.exports.remove_credential = remove_credential;
module.exports.update_credential = update_credential;
module.exports.get_all_credential= get_all_credential;