//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('../Database/database_access.js');



// Declare a new Asynchronous function using promises
async function validate_user(package) {
    if (package.task_data.hasOwnProperty('password') && package.hasOwnProperty('username')) {
        support.log("debug", "p_logon_handler.js - validate_user : validating User...");

        const user_hash_retrieval_query = `SELECT hash, exp_date
        FROM credential
        Where user_id in (SELECT id from user where username = "${package.username}");
        `
        db.promise_pool.query(user_hash_retrieval_query).then((rows) => {
            support.log("debug", `p_logon_handler.js - validate_user : user found = ${rows}`);

            const r_msg = {
                "status": 1,
                "Message": `user :  ${package.username} was found`,
                "insertId": rows[0].insertId
            };

            // resolve returning the data package containing the details
            resolve(r_msg);


        }).catch((error) => {

            support.log("error", `Unable to validate user, db promise pool could not fulfill the query, ERROR : \n ${error}`);
            const r_msg = {
                "status": 0,
                "Message": error
            };

            // resolve returning the data package containing the details
            reject(r_msg);
        });


    }
    else{
        support.log("debug", "p_logon_handler.js - validate_user : unable to validate user with incomplete data package.")

        const r_msg = {
            "status": 0,
            "Message": "Can NOT validate_user, insufficient information to preform request",
        };
        reject(r_msg);
    }
    


};

//export required module components
module.exports.validate_user = validate_user;