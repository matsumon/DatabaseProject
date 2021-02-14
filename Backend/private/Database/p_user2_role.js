//import all required support functionality
const config = require('../../init_config.json');
const support = require('../support.js');
const db = require('./database_access.js');


async function create_association(package){
    return new Promise((resolve, reject) => {
        support.log("debug", "p_user2role.js - Creating Association between user and role")
        if (package.task_data.hasOwnProperty("userID")&&
            package.task_data.hasOwnProperty("roleID")){

                const create_association_query = `INSERT INTO ${config.db_rootDatabase}.user_to_role (user_id, role_id)
                VALUES (${package.task_data.userID},${package.task_data.roleID});`

                db.promise_pool.query(create_association_query).then((rows) =>{

                    support.log("debug", `p_user2role.js - Association between user and role Created`);

                    const r_msg = {
                        "status": 1,
                        "Message": `user2role association Successfully Created`,
                    };
    
                    // resolve returning the data package containing the details
                    resolve(r_msg);

                }).catch(error =>{
                    // our query failed, log the incident
                    support.log("error", "p_user2_role.js - create_association : Unable to create user2role association db.promise_pool failed to service the query")
                    support.log("error", `Error Message: - ${error}`)
                    // reject our promise, promoting the application pools failure as needed.
                    reject(error);
                })

        }else{
            support.log("error", "p_user2_role.js - create_association : Aborted Execution due to unexpected or missing Key-Value pairs");
            reject("Supplied Object does not contain the expected key-value pairs to complete operation, Operation aborted.");
        }

    })
}

module.exports.create_association = create_association;