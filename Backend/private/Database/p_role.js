//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('./database_access.js');


async function new_role(package) {
    return new Promise((resolve, reject) => {
        support.log("debug", "p_role.js - new_role - Started Creation of new ROLE")
        if (package.task_data.hasOwnProperty("role_title")) {
            support.log("debug", "p_role.js - new_role - field validation OK, continuing exec....")

            // code to add role
            const role_creation_query = `
                INSERT INTO ${config.db_rootDatabase}.role (role_title)
                VALUES("${package.task_data.role_title}");
                `
            db.promise_pool.query(role_creation_query).then(rows => {
                support.log("debug", `p_role.js - new_role :role Created - ID of new Object = ${rows[0].insertId}`);

                const r_msg = {
                    "status": 1,
                    "Message": `Role successfully created!`,
                    "id": `${rows[0].insertId}`
                };

                // resolve returning the data package containing the details
                resolve(r_msg);
            }).catch((error) => {
                support.log("error", `p_role.js - ADD_ROLE: unable to create ROLE db pool failed to service the request: \n ${error}`);
                const r_msg = {
                    "status": 0,
                    "Message": "Can NOT create ROLE db pool unable to service request",
                    "error": error
                };
                reject(r_msg);
            })

        } else {
            //handle failure to provide minimum required values in task data body
            support.log("error", `p_role.js - new_role : unable to create new role, Request did not provide them minimum required parameters`);
            const r_msg = {
                "status": 0,
                "Message": "Can NOT create new_role, minimum params were not provided in task_data body",
            };
            reject(r_msg)
        }
    })
}

async function get_roleids(){
    return new Promise((resolve, reject)=>{
        support.log("debug", "p_role.js  - get_roleids Getting all Role IDS");

        const get_userids_query = `SELECT id FROM ${config.db_rootDatabase}.role;`

        db.promise_pool.query(get_userids_query).then((rows) => {
            support.log("debug", `p_role.js - get_roleids : Retrieved ALL ROLE ID's`);
            const r_msg = {
                "status": 1,
                "Message": `User ids Successfully Retrieved`,
                "Results": rows[0]
            };
            // resolve returning the data package containing the details
            resolve(r_msg);
        }).catch((error) => {
            // our query failed, log the incident
            support.log("error", "p_role.js - get_roleids : Unable to get role ids db.promise_pool failed to service the query")
            // reject our promise, promoting the application pools failure as needed.
            reject(error);
        })
    });
}
module.exports.new_role = new_role;
module.exports.get_roleids = get_roleids;