//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const bcrypt = require('bcrypt');
const db = require('./database_access.js');



//define required functions
async function create_user(package) {
    return new Promise((resolve, reject) => {
        if (package.hasOwnProperty('username') &&
            package.hasOwnProperty('email')) {
            support.log("debug", `p_user.js - create_user : Creating user ${package.username}`);

            const create_user_query = `INSERT INTO ${config.db_rootDatabase}.user
               (username,
               created_at,
               email)
               VALUES
               ('${package.username}',
               current_timestamp(),
               '${package.email}')`

            db.promise_pool.query(create_user_query).then((rows) => {
                support.log("debug", `p_user.js - create_user : created new User - ID of new Object = ${rows[0].insertId}`);
                const r_msg = {
                    "status": 1,
                    "Message": `Password successfully set for user_id ${package.user_id}`,
                    "insertId": rows[0].insertId
                };
                // resolve returning the data package containing the details
                resolve(r_msg);
            }).catch((error) => {
                // our query failed, log the incident
                support.log("error", "p_user.js - create_user : Unable to create new User db.promise_pool failed to service the query")
                // reject our promise, promoting the application pools failure as needed.
                reject(error);
            })
        }
    });

};


// export required functions
module.exports.create_user = create_user;
