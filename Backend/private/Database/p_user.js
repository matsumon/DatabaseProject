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
async function update_user(package) {
    return new Promise((resolve, reject) => {
        if (package.hasOwnProperty('username') &&
            package.hasOwnProperty('email') &&
            package.hasOwnProperty('username')) {
            support.log("debug", `p_user.js - update_user : updating_user ${package.username}`);

        }
    })
};
async function remove_user(package) {
    return new Promise((resolve, reject) => {
        if (package.hasOwnProperty('id')) {
            support.log("debug", `p_user.js - remove_user : Removing user ${package.id}`);



        }
    });
};

async function get_users() {
    return new Promise((resolve, reject) => {
        support.log("debug", `p_user.js - get_users : Getting ALL USERS`);

        const get_users_query = `SELECT * FROM ${config.db_rootDatabase}.user;`

        db.promise_pool.query(get_users_query).then((rows) => {
            support.log("debug", `p_user.js - get_users : Retrieved ALL USERS`);
            const r_msg = {
                "status": 1,
                "Message": `Users Successfully Retrieved`,
                "Results": rows[0]
            };
            // resolve returning the data package containing the details
            resolve(r_msg);

        }).catch((error) => {
            // our query failed, log the incident
            support.log("error", "p_user.js - get_users : Unable to get users db.promise_pool failed to service the query")
            // reject our promise, promoting the application pools failure as needed.
            reject(error);
        })

    });

};

async function get_all_userid() {
    return new Promise((resolve, reject) => {
        support.log("debug", "p_user.js - get_all_userid: Getting all UserID");

        const get_userids_query = ` SELECT id FROM ${config.db_rootDatabase}.user;`

        db.promise_pool.query(get_userids_query).then((rows) => {
            support.log("debug", `p_user.js - get_all_userid : Retrieved ALL USERS ID's`);
            const r_msg = {
                "status": 1,
                "Message": `User ids Successfully Retrieved`,
                "Results": rows[0]
            };
            // resolve returning the data package containing the details
            resolve(r_msg);
        }).catch((error) => {
            // our query failed, log the incident
            support.log("error", "p_user.js - get_all_userid : Unable to get users db.promise_pool failed to service the query")
            // reject our promise, promoting the application pools failure as needed.
            reject(error);
        })

    });
};


// export required functions
module.exports.create_user = create_user;
module.exports.update_user = update_user;
module.exports.remove_user = remove_user;
module.exports.get_users = get_users;
module.exports.get_all_userid = get_users;